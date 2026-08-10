
import AddArticleForm from '@/features/articles/create/components/AddArticleForm/AddArticleForm';
import styles from './CreateArticlePage.module.css';
import type { Metadata } from "next";

const siteUrl = "";
const pageTitle = "Create an article | Harmoniq";
const pageDescription = "Create a new personal article in Harmoniq.";
const pageUrl = `${siteUrl}/articles/create`;
const ogImage = "";

export const metadata: Metadata = {
 title: pageTitle,
 description: pageDescription,
 alternates: {
   canonical: pageUrl,
 },
 openGraph: {
   title: pageTitle,
   description: pageDescription,
   url: pageUrl,
   images: [
     {
       url: ogImage,
       width: 1200,
       height: 630,
       alt: "Create an article",
     },
   ],
 },
};


export default function CreateArticlePage() {
 return (
   <main className={`container ${styles.page}`}>
     <h1 className={styles.title}>Create an article</h1>


     <AddArticleForm />
   </main>
 );
}

