import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import LiveChart from './pages/live-chart/LiveChart'
import Auction from './pages/auction/Auction'
import type { MenuProps } from 'antd'
import { ConfigProvider, Flex, Layout, Menu, theme } from 'antd'
import { AuditOutlined, FormOutlined, LoginOutlined, LogoutOutlined, SlidersOutlined } from '@ant-design/icons'
import Login from './pages/auction/Login'
import Register from './pages/auction/Register'

type MenuItem = Required<MenuProps>['items'][number]

const layoutStyle = {
  overflow: 'hidden',
  backgroundColor: '#0c0e11',
}

const AppContent: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname.substring(1) || 'live-chart'
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    // Check if user is logged in when component mounts or location changes
    const token = localStorage.getItem('accessToken')
    setIsLoggedIn(!!token)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    setIsLoggedIn(false)
    navigate('/live-chart')
  }

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        label: <Link to="/live-chart">Live Chart</Link>,
        key: 'live-chart',
        icon: <SlidersOutlined />,
      },
    ]

    if (isLoggedIn) {
      baseItems.push(
        {
          label: <Link to="/auction">Auction</Link>,
          key: 'auction',
          icon: <AuditOutlined />,
        },
        {
          label: 'Logout',
          key: 'logout',
          icon: <LogoutOutlined />,
          onClick: handleLogout,
        }
      )
    } else {
      baseItems.push(
        {
          label: <Link to="/login">Login</Link>,
          key: 'login',
          icon: <LoginOutlined />,
        },
        {
          label: <Link to="/register">Register</Link>,
          key: 'register',
          icon: <FormOutlined />,
        }
      )
    }

    return baseItems
  }

  return (
    <>
      <Menu selectedKeys={[currentPath]} mode="horizontal" items={getMenuItems()} />

      <Routes>
        <Route path="/" element={<LiveChart />} />
        <Route path="/live-chart" element={<LiveChart />} />
        <Route path="/auction" element={<Auction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

const App: React.FC = () => {
  return (
    <Flex gap="middle" wrap>
      <Layout style={layoutStyle}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Router>
            <AppContent />
          </Router>
        </ConfigProvider>
      </Layout>
    </Flex>
  )
}

export default App
