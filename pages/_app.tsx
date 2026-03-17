import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from '../src/components/Header';
import Footer from '../src/components/Footer';
import { store} from '../src/redux/store';
// import { Provider } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import PopupAlert from '../src/components/PopupAlert';
import { Provider } from 'react-redux';
import Loader from '../src/components/Loader';
import ConfirmAlert from '../src/components/ConfirmAlert';
import SetUp from '../src/redux/setUpInterceptors';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Loader/>
      <ConfirmAlert/>
      <PopupAlert  />
      <Header/>
      <Component {...pageProps} />
      <Footer />
    </Provider>
  )

}
SetUp();
export default MyApp
