import HeroSectionCommon from "@/components/HeroSectionCommon";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="blog">
          <HeroSectionCommon heading="Home/Check Out" />
        </div>
        {children}
      </body>
    </html>
  );
}
