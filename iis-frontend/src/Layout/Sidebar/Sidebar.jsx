import { Button, Layout, theme } from 'antd';
import React, { useState } from 'react';
import unfold from '../../assets/Logo/Instagram_logo 1.svg'
import fold from '../../assets/Logo/sigmahealthpro-converted-4@2x.png'
import MenuList from '../../components/Menu/MenuList';
import { Header } from 'antd/es/layout/layout';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
const {Sider} = Layout;
const Sidebar = () => {

    const [ collapsed, setCollapsed] = useState(false);
 
    return (
        <div>
            <Layout >
                <Sider collapsed={collapsed} collapsible trigger={null} className='sidebar h-screen p-3'> 
                    <img src={!collapsed ? unfold : fold} alt=" Sigma Health Logo" style={collapsed ? { width: '32px', height: '40px', marginTop : '20%', marginLeft: '20%', marginBottom:'26px'} : { width: '160px', height: '60px', marginTop : '10%', marginLeft: '5px', marginBottom:'26px'}}/>
                    <MenuList/>
                </Sider>
                <Layout>
                    <Header style={{padding: 0}}>
                        <Button type='text' className='toggle' 
                        onClick={()=> setCollapsed(!collapsed)}
                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}/>
                    </Header>
                </Layout>
            </Layout>
        </div>
    );
};

export default Sidebar;