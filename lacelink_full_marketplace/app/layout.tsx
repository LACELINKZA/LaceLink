
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body style={{fontFamily:'sans-serif'}}>
        <header style={{padding:20,fontWeight:'bold'}}>LaceLink Marketplace</header>
        {children}
        <footer style={{padding:20}}>© LaceLink</footer>
      </body>
    </html>
  );
}
