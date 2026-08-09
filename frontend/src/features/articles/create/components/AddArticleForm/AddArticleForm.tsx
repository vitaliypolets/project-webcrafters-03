'use client';

import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createArticleSchema } from '../../create-article.schema';
import { createArticle } from '../../create-article.service';
import type { CreateArticleFormValues } from '../../create-article.types';
import css from './AddArticleForm.module.css';
import ArticleImagePreview from '../ArticleImagePreview/ArticleImagePreview';



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
     alert('Article created successfully!');
     router.push(`/articles/${article._id}`);
   },

   onError: error => {
     alert(
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
     }) => (
       <Form className={css.form}>
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


         <div className={css.titleField}>
           <label
             htmlFor="title"
             className={css.label}
           >
             Title
           </label>


           <Field
             id="title"
             name="title"
             type="text"
             placeholder="Enter the title"
             className={css.input}
           />


           <ErrorMessage
             name="title"
             component="p"
             className={css.error}
           />
         </div>


         <div className={css.descriptionField}>
           <Field
             as="textarea"
             id="description"
             name="description"
             placeholder="Enter a text"
             className={css.textarea}
           />


           <ErrorMessage
             name="description"
             component="p"
             className={css.error}
           />
         </div>


         <button
           type="submit"
           className={css.submitButton}
           disabled={isSubmitting || isPending}
         >
           {isSubmitting || isPending
             ? 'Publishing...'
             : 'Publish Article'}
         </button>
       </Form>
     )}
   </Formik>
 );
};

export default AddArticleForm;
