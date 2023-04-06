import Icon from 'supercons'
//INTL
import { IntlProvider, useIntl } from 'react-intl';
import enUS from './locales/en-US.json'
import zhCN from './locales/zh-CN.json'

//路由
import { BrowserRouter as Routes,useNavigate,useRoutes } from 'react-router-dom';

//redux
import { useDispatch,useSelector } from 'react-redux';
//组件
import Index from './Router/index'
function App() {
  const {lang}  = useSelector(store=>store.demo);
  console.log(lang);
  return (
    <IntlProvider locale={lang} messages={lang === 'en-US' ? enUS : zhCN}>
      <Routes>
        <Index></Index>
      </Routes>
    </IntlProvider>
  );
}

export default App;
