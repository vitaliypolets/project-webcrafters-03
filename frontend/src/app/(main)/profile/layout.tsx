
type ProfileLayoutProps = {
  children: React.ReactNode;
  myArticles: React.ReactNode;
  savedArticles: React.ReactNode;
};

export default function ProfileLayout({
  children,
  myArticles,
  savedArticles,
}: ProfileLayoutProps) {
  return (
    <section>
      {children}
      <div data-profile-slot="my-articles">{myArticles}</div>
      <div data-profile-slot="saved-articles">{savedArticles}</div>
    </section>
  );
}
