import '../styles/global.css';
import Layout from '../components/Layout';
import { AuthProvider } from '../context/authContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider initialUser={pageProps?.initialUser}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
