import "./globals.css"; // Import global styles
import {Navigation} from "./components/Navigation"; // Updated import

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation /> {/* Updated component name */}
        <main>{children}</main>
      </body>
    </html>
  );
}
