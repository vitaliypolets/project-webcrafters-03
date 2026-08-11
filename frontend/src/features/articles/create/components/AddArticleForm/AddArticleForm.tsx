'use client';

import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { createArticleSchema } from '../../create-article.schema';
import { createArticle } from '../../create-article.service';
import type { CreateArticleFormValues } from '../../create-article.types';

import ArticleImagePreview from '../ArticleImagePreview/ArticleImagePreview';
import css from './AddArticleForm.module.css';
import Button from '@/components/ui/Button/Button';


const getCurrentDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const initialValues: CreateArticleFormValues = {
  title: '',
  description: '',
  image: null,
  publicationDate: getCurrentDate(),
};

const AddArticleForm = () => {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createArticle,

    onSuccess: article => {
      toast.success('Article created successfully!');
      router.push(`/articles/${article._id}`);
    },

    onError: error => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create article',
      );
    },
  });

  const handleImageChange = (
    file: File | null,
    setFieldValue: (
      field: string,
      value: unknown,
    ) => void,
  ) => {
    setFieldValue('image', file);

    if (!file) {
      setPreviewUrl('');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (
    values: CreateArticleFormValues,
  ) => {
    await mutateAsync(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createArticleSchema}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        setFieldValue,
        errors,
        touched,
        values,
      }) => (
        <Form className={css.form}>
          {/* IMAGE */}

          <div className={css.imageField}>
            <ArticleImagePreview
              previewUrl={previewUrl}
              onChange={file =>
                handleImageChange(file, setFieldValue)
              }
              error={
                touched.image && errors.image
                  ? errors.image
                  : undefined
              }
            />
          </div>

          {/* TITLE */}

          <div className={css.titleField}>
            <label
              htmlFor="title"
              className={css.label}
            >
              Title
            </label>

            <div
              className={`${css.inputWrapper} ${
                touched.title && errors.title
                  ? css.errorState
                  : values.title
                    ? css.filledState
                    : ''
              }`}
            >
              <svg
                className={css.inputIcon}
                aria-hidden="true"
              >
                <use href="/icons/sprite.svg#icon-home" />
              </svg>

              <Field
                id="title"
                name="title"
                type="text"
                placeholder="Enter the title"
                className={css.input}
              />

              <svg
                className={css.inputIcon}
                aria-hidden="true"
              >
                <use href="/icons/sprite.svg#icon-home" />
              </svg>
            </div>

            <ErrorMessage
              name="title"
              component="p"
              className={css.error}
            />
          </div>

          {/* DESCRIPTION */}

          <div className={css.descriptionField}>
            <div
              className={`${css.textareaWrapper} ${
                touched.description && errors.description
                  ? css.errorState
                  : values.description
                    ? css.filledState
                    : ''
              }`}
            >
              <svg
                className={css.textareaIcon}
                aria-hidden="true"
              >
                <use href="/icons/sprite.svg#icon-home" />
              </svg>

              <Field
                as="textarea"
                id="description"
                name="description"
                placeholder="Enter a text"
                className={css.textarea}
              />

              <svg
                className={css.textareaIcon}
                aria-hidden="true"
              >
                <use href="/icons/sprite.svg#icon-home" />
              </svg>
            </div>

            <ErrorMessage
              name="description"
              component="p"
              className={css.error}
            />
          </div>

          {/* SUBMIT */}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className={css.submitButton}
            disabled={isSubmitting || isPending}
           >
           {isSubmitting || isPending
             ? 'Publishing...'
             : 'Publish Article'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddArticleForm;
