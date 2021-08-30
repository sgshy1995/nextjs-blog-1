import 'styles/globals.scss'
import 'styles/posts.scss'
import 'styles/sign_up.scss'
import 'antd/dist/antd.css';
import 'styles/iconfont.css'
import {Provider} from 'react-redux'
import {useStore} from 'redux/store'

const App = ({Component, pageProps}) => {
    const store = useStore(pageProps.initialReduxState)

    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    )
}

export default App;