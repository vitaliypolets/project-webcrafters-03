'use client';

import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { createArticleSchema } from '../../create-article.schema';
import { createArticle } from '../../create-article.service';
import type { CreateArticleFormValues } from '../../create-article.types';

import Button from '@/components/ui/Button/Button';
import { useArticleDraftStore } from '@/store/articleDraftStore';

import ArticleImagePreview from '../ArticleImagePreview/ArticleImagePreview';

import css from './AddArticleForm.module.css';

const getCurrentDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const AddArticleForm = () => {
  const router = useRouter();

  const { draft, setDraft, clearDraft } =
    useArticleDraftStore();

  const [previewUrl, setPreviewUrl] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createArticle,

    onSuccess: article => {
      clearDraft();
      setPreviewUrl('');

      toast.success('Article created successfully!');

      router.push(`/articles/${article.id}`);
    },

    onError: error => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create article',
      );
    },
  });

  const initialValues: CreateArticleFormValues = {
    title: draft.title,
    article: draft.article,
    image: null,

    // Publication date is always the current date.
    // It is not taken from the draft.
    publicationDate: getCurrentDate(),
  };

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
      enableReinitialize
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
                  ? String(errors.image)
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
                onChange={(
                  event: React.ChangeEvent<HTMLInputElement>,
                ) => {
                  const value =
                    event.target.value;

                  setFieldValue('title', value);

                  setDraft({
                    ...draft,
                    title: value,
                  });
                }}
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

          {/* ARTICLE */}

          <div className={css.descriptionField}>
            <div
              className={`${css.textareaWrapper} ${
                touched.article && errors.article
                  ? css.errorState
                  : values.article
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
                id="article"
                name="article"
                placeholder="Enter a text"
                className={css.textarea}
                onChange={(
                  event: React.ChangeEvent<HTMLTextAreaElement>,
                ) => {
                  const value =
                    event.target.value;

                  setFieldValue('article', value);

                  setDraft({
                    ...draft,
                    article: value,
                  });

                  event.target.style.height =
                    'auto';

                  event.target.style.height = `${event.target.scrollHeight}px`;
                }}
              />

              <svg
                className={css.textareaIcon}
                aria-hidden="true"
              >
                <use href="/icons/sprite.svg#icon-home" />
              </svg>
            </div>

            <ErrorMessage
              name="article"
              component="p"
              className={css.error}
            />
          </div>

          {/* PUBLICATION DATE */}

          <div className={css.formGroup}>
            <label
              htmlFor="publicationDate"
              className={css.label}
            >
              Publication date
            </label>

            <Field
              id="publicationDate"
              name="publicationDate"
              type="text"
              className={css.input}
              value={values.publicationDate}
              readOnly
              aria-readonly="true"
            />

            <ErrorMessage
              name="publicationDate"
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
            disabled={
              isSubmitting || isPending
            }
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
