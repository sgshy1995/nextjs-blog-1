import png from 'assets/images/pngsucai.png';
import {GetServerSideProps, NextPage} from 'next';
import {UAParser} from 'ua-parser-js';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    browser: {
        name: string;
        version :string;
        major: string;
    };
    device: {
        type: string;
        model: string;
        vendor: string;
    };
    cpu: {
        architecture: string | undefined;
    };
    os: {
        name: string;
        version: string;
    };
    engine: {
        name: string;
        version: string;
    }
}

const Home:NextPage<Props> = (props) => {
    const info = props
    return (
        <div className="main">
            <div>首页</div>
            <div>您的浏览器是 <span className="info-tips">{info.browser.name || '未知'}</span>，版本为 <span className="info-tips">{info.browser.version || '未知'}</span></div>
            <div>您的操作系统是 <span className="info-tips">{info.os.name || '未知'}</span>，版本为 <span className="info-tips">{info.os.version || '未知'}</span></div>
            <div>您的设备型号是 <span className="info-tips">{info.device.type || '未知'}</span></div>
            <Image
                src={png}
                alt="avatar"
                width={100}
                height={100}
            />
            <Link href="/posts">
                <a>跳转到博客页</a>
            </Link>
        </div>
    );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const ua = context.req.headers['user-agent'];
    const info = new UAParser(ua).getResult();
    Object.keys(info).map(key=>{
        const infoInner:any = (info as any)[key]
        Object.keys(infoInner).map(keyIn=>{
            if (!infoInner[keyIn]) infoInner[keyIn] = null
        })
    })
    console.log('info',info)
    return {
        props: {
            browser: info.browser,
            cpu: info.cpu,
            device: info.device,
            os: info.os,
            engine: info.engine
        }
    };
};
