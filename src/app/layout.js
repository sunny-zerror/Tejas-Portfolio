import "../styles/globals.css";
import "../styles/fonts.css";
import "../styles/website.css";

export const experimental = {
  viewTransition: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
