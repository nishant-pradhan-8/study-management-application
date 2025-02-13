'use client'
import React, { use, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

import { ReactNode } from 'react';
import { navOptions } from '@/types/types';
import { useAppContext } from '@/context/context';
import AlertDialogOverlay from './alertDialogOverlay';
const { Header, Sider, Content } = Layout;
const HomeLayout = ({children}:{ children: ReactNode}) => {
  const [collapsed, setCollapsed] = useState(false);
 
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navOptions:navOptions[] = [
    {
       id: 1,
       name: 'Home',
       route: "/",
       icon: '/images/home-light.svg'
    },
    { 
      id: 2,
      name: 'Study Folders',
       route: "/study-folders",
      icon: '/images/folder-light.svg'
   },
   { 
    id: 3,
    name: 'Friends',
     route: "/friends",
    icon: '/images/friends-light.svg'
 },
 { 
  id: 4,
  name: 'Shared Resources',
   route: "/shared-resources",
  icon: '/images/sharedResources.svg'
}
  ]
  
  const pathName:string = usePathname()

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
         <nav className='mt-8'>
          <ul className='flex flex-col gap-4 px-2'>
            {
              navOptions.map((nav)=>(
                  <li  key={nav.id}>
                    <Link href={nav.route} className={`flex flex-row items-center gap-2 ${pathName===nav.route?'text-blue-400':''}`}>
                      <Image src={nav.icon} width={20} height={20} alt='folder' /> 
                       {nav.name}
                     </Link>
                  </li>
              ))
            }
          </ul>
         </nav>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className='flex justify-between items-center !pr-4'>
          
          <div className='flex items-center gap-2'>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h1 className='font-bold text-2xl'>LOGO</h1>
          </div>
          
          <div className='flex items-center gap-4 '>
            <a><div className=''> <Image src="/images/notifications.svg" width={20} height={20} alt='settings' /> </div></a>
            <a><div className=''><Image src="/images/settings.svg" width={20} height={20}  alt='settings' /> </div></a>
            <a><div className='w-8 h-8 bg-black rounded-full'> </div></a>
          </div>
         
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflowY:'scroll'
          }}
        
       
        >
          <AlertDialogOverlay />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeLayout;