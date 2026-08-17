"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button/Button";
import { fetchArticleById } from "@/features/articles/details/article-details.service";

import { editArticleSchema } from "../../edit-article.schema";
import { updateArticle } from "../../edit-article.service";
import type { EditArticleFormValues } from "../../edit-article.types";

import styles from "./EditArticleForm.module.css";

type EditArticleFormProps = {
  articleId: string;
};

const EditArticleForm = ({ articleId }: EditArticleFormProps) => {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => fetchArticleById(articleId),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: EditArticleFormValues) => updateArticle(articleId, values),

    onSuccess: () => {
      toast.success("Article updated successfully!");
      router.push(`/articles/${articleId}`);
      router.refresh();
    },

    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update article");
    },
  });

  if (isLoading) {
    return <p className={styles.status}>Loading article...</p>;
  }

  if (isError || !data?.article) {
    return <p className={styles.status}>Failed to load article.</p>;
  }

  const initialValues: EditArticleFormValues = {
    title: data.article.title,
    article: data.article.article,
    publicationDate: data.article.publicationDate.slice(0, 10),
    image: null,
  };

  const handleSubmit = async (values: EditArticleFormValues) => {
    await mutateAsync(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={editArticleSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue, errors, touched, values }) => (
        <Form className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Article Title
            </label>

            <Field
              className={styles.input}
              id="title"
              name="title"
              type="text"
              placeholder="Enter the title"
            />

            <ErrorMessage name="title" component="p" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="article">
              Article
            </label>

            <Field
              as="textarea"
              className={styles.textarea}
              id="article"
              name="article"
              placeholder="Enter a text"
            />

            <ErrorMessage name="article" component="p" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="publicationDate">
              Publication date
            </label>

            <Field
              className={styles.input}
              id="publicationDate"
              name="publicationDate"
              type="text"
              value={values.publicationDate}
              readOnly
              aria-readonly="true"
            />

            <ErrorMessage name="publicationDate" component="p" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="image">
              Image
            </label>

            <div className={styles.fileUpload}>
              <label className={styles.fileButton} htmlFor="image">
                Choose file
              </label>

              <input
                className={styles.hiddenFileInput}
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] ?? null;

                  setFieldValue("image", file);
                }}
              />

              <span className={styles.fileName}>{values.image?.name ?? "No file chosen"}</span>
            </div>

            {touched.image && errors.image && (
              <p className={styles.error}>{String(errors.image)}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting || isPending}
            className={styles.submitButton}
          >
            {isSubmitting || isPending ? "Saving..." : "Save changes"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditArticleForm;
