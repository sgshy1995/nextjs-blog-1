import png from 'assets/images/pngsucai.png';
import avatar from 'assets/images/avatar.jpeg';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import {UAParser} from 'ua-parser-js';
import Image from 'next/image';
import Link from 'next/link';
import {getDBConnection} from 'lib/getDBConnection';
import {Post} from 'src/entity/Post';
import {withSession} from 'lib/withSession';
import {User} from '../src/entity/User';
import React, {ReactComponentElement} from 'react';
import {Layout, Menu, Row, Col, Input, Badge, Divider, Avatar} from 'antd';
import { initializeStore } from 'store/store'

const {Sider, Content} = Layout;
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
    SearchOutlined,
    MessageFilled,
    BellFilled,
    UserOutlined
} from '@ant-design/icons';

type Props = {
    browser?: {
        name: string;
        version: string;
        major: string;
    };
    device?: {
        type: string;
        model: string;
        vendor: string;
    };
    cpu?: {
        architecture: string | undefined;
    };
    os?: {
        name: string;
        version: string;
    };
    engine?: {
        name: string;
        version: string;
    };
    posts?: Post[],
    user?: User | null,
    innerPage?: ReactComponentElement<any>,
    initialReduxState?: {user: User}
}

const Home: NextPage<Props> = (props) => {

    console.log('props=========================',props)

    const suffix = (
        <SearchOutlined
            style={{
                fontSize: 16,
                color: '#1890ff',
            }}
        />
    );
    const MessageIcon = (
        <MessageFilled
            style={{
                fontSize: 20,
                color: '#1890ff',
                marginLeft: '20px'
            }}
        />
    );
    const BellIcon = (
        <BellFilled
            style={{
                fontSize: 20,
                color: '#1890ff'
            }}
        />
    );

    const info = props;
    // @ts-ignore
    // @ts-ignore
    return (
        <div className="main">
            <Layout>
                <Sider>
                    <div className="logo">
                        <i className="iconfont icon-blog"/>
                        <span>????????????</span>
                    </div>
                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                    >
                        <Menu.Item key="1" icon={<PieChartOutlined/>}>
                            Option 1
                        </Menu.Item>
                        <Menu.Item key="2" icon={<DesktopOutlined/>}>
                            Option 2
                        </Menu.Item>
                        <Menu.Item key="3" icon={<ContainerOutlined/>}>
                            Option 3
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content>
                        <Row className="content-header" gutter={24}>
                            <Col span={16}>
                                <Input size="large" placeholder="????????????" suffix={suffix}/>
                            </Col>
                            <Col span={8}>
                                <Row className="user-info">
                                    <Col span={10}>
                                        <Badge count={5} color="magenta">
                                            {BellIcon}
                                        </Badge>
                                        <Badge count={9} color="magenta">
                                            {MessageIcon}
                                        </Badge>
                                    </Col>
                                    <Col span={1}>
                                        <Divider type="vertical"/>
                                    </Col>
                                    <Col span={13}>
                                        <span className="user-name">
                                            {props.initialReduxState.user ? props.initialReduxState.user.username : '?????????'}
                                        </span>
                                        {props.initialReduxState.user ? <Avatar className="user-avatar" size={32}
                                                              src={<Image layout="fill" src={avatar}/>}
                                        /> : <Avatar size={32} icon={<UserOutlined/>}/>}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="content-in">
                            <div className="device-info">
                                <div>?????????????????? <span className="info-tips">{ (info.browser && info.browser.name) || '??????'}</span>???????????? <span className="info-tips">{ (info.browser && info.browser.version) || '??????'}</span></div>
                                <div>????????????????????? <span className="info-tips">{(info.os && info.os.name) || '??????'}</span>???????????? <span className="info-tips">{(info.os && info.os.version) || '??????'}</span></div>
                                <div>????????????????????? <span className="info-tips">{(info.device && info.device.type) || '??????'}</span></div>
                            </div>
                            <div>
                                { JSON.stringify((info.initialReduxState && info.initialReduxState.user) || null) }
                            </div>
                            { props.innerPage }
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
        /*<div className="main">
            { props.user && <div>????????????????????????{props.user.username}</div> }
            <div>??????</div>
            <div>?????????????????? <span className="info-tips">{info.browser.name || '??????'}</span>???????????? <span className="info-tips">{info.browser.version || '??????'}</span></div>
            <div>????????????????????? <span className="info-tips">{info.os.name || '??????'}</span>???????????? <span className="info-tips">{info.os.version || '??????'}</span></div>
            <div>????????????????????? <span className="info-tips">{info.device.type || '??????'}</span></div>
            <Image
                src={png}
                alt="avatar"
                width={100}
                height={100}
            />
            <Link href="/posts">
                <a>??????????????????</a>
            </Link>
            <div>
                <div>???????????????</div>
                {
                    info.posts.map(post=>{
                        return (
                            <Link key={post.id} href={`/posts/${post.id}`}>
                                <a>{post.title}</a>
                            </Link>
                        )
                    })
                }
            </div>
        </div>*/
    );
};



export default Home;

export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {

    const reduxStore = initializeStore()
    const { dispatch } = reduxStore

    console.log('?????????===================SSR',reduxStore.getState())
    // ?????? connection
    const connection = await getDBConnection();
    const posts = await connection.manager.find(Post);

    // @ts-ignore
    const user = context.req.session.get('currentUser') || null;

    dispatch({
        type: 'USER',
        user
    })

    const ua = context.req.headers['user-agent'];
    const info = new UAParser(ua).getResult();
    Object.keys(info).map(key => {
        const infoInner: any = (info as any)[key];
        Object.keys(infoInner).map(keyIn => {
            if (!infoInner[keyIn]) infoInner[keyIn] = null;
        });
    });
    console.log('info', info);
    return {
        props: {
            browser: info.browser,
            cpu: info.cpu,
            device: info.device,
            os: info.os,
            engine: info.engine,
            posts: JSON.parse(JSON.stringify(posts)),
            user: user,
            initialReduxState: reduxStore.getState()
        }
    };
});
