import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { error: null } }
    static getDerivedStateFromError(error) { return { error } }
    render() {
        if (this.state.error) {
            return <div style={{padding:'2rem',color:'red',fontFamily:'monospace',whiteSpace:'pre-wrap'}}>
                {String(this.state.error)}
            </div>
        }
        return this.props.children
    }
}

import { Navbar, BreadcrumbBar, Footer } from './components/layout'
import { Spinner } from './components/loading-and-error-views'
import { HomePage } from './components/home'
import { AdminPage } from './components/admin'
import { HelpCenter } from './components/help-center'
import { AllCompoundsContainer } from './components/table-containers'
import { siteName } from './utilities'
import apiService from './data/ApiService'

function ProtectedRoute({ children, adminOnly, userInfo }) {
    if (!userInfo || !userInfo.role) {
        return (
            <Spinner
                size={40}
                style={{ position: 'absolute', top: 'calc(50vh - 20px)', left: 'calc(50% - 20px)' }}
            />
        )
    }
    if (adminOnly && userInfo.role?.toUpperCase() !== 'ADMIN') {
        return <div className="h3" style={{ padding: '2rem' }}>Access denied. Role: {userInfo.role}</div>
    }
    return children
}

function App() {
    const location = useLocation()
    const [userInfo, setUserInfo] = React.useState({})
    const [summary, setSummary] = React.useState({})
    const [compoundsColumnsConfig, setCompoundsColumnsConfig] = React.useState(new Map())
    const [similarityColumnsConfig, setSimilarityColumnsConfig] = React.useState(new Map())
    const [loading, setLoading] = React.useState(true)
    const [isServerDown, setIsServerDown] = React.useState(false)

    const userInfoStore = {
        userInfo,
        setUserInfo: (info) => setUserInfo(info || {})
    }

    const compoundsStore = {
        summary,
        setSummary: (res) => setSummary(res || {})
    }

    const compoundsColumnsConfigStore = {
        config: compoundsColumnsConfig,
        setSavedConfig: (map) => setCompoundsColumnsConfig(map)
    }

    const similarityColumnsConfigStore = {
        config: similarityColumnsConfig,
        setSavedConfig: (map) => setSimilarityColumnsConfig(map)
    }

    const apiRequest = async (route, setDataCallback, isDataAlreadyPresent = false) => {
        if (!isDataAlreadyPresent) {
            try {
                const res = await apiService.get(route)
                setDataCallback(res)
            } catch (err) {
                setIsServerDown(true)
                console.log(`Network Error, unable to get ${route}`, err.message)
            }
        }
    }

    const getUserInfo = async () => {
        await apiRequest(
            'userInfo',
            res => {
                setUserInfo(res || {})
                if (res && res.column_config) {
                    setCompoundsColumnsConfig(new Map(JSON.parse(res.column_config)))
                }
                if (res && res.similarity_column_config) {
                    setSimilarityColumnsConfig(new Map(JSON.parse(res.similarity_column_config)))
                }
            },
            !!userInfo.role
        )
    }

    const getCompoundsSummary = async () => {
        await apiRequest(
            'compoundsSummary',
            res => setSummary(res || {}),
            !!Object.keys(summary).length
        )
    }

    React.useEffect(() => {
        Promise.all([getUserInfo(), getCompoundsSummary()])
            .then(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <Spinner
                size={80}
                style={{ position: 'absolute', top: 'calc(50vh - 40px)', left: 'calc(50% - 40px)' }}
            />
        )
    }

    if (isServerDown) {
        return <div className="h0 site-down">{`${siteName} Service Temporarily Offline`}</div>
    }

    return (
        <ErrorBoundary>
        <div className="app-container">
            <Navbar userInfoStore={userInfoStore} />
            {location.pathname !== '/' && <BreadcrumbBar />}
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute userInfo={userInfo}>
                            <HomePage userInfoStore={userInfoStore} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/compounds"
                    element={
                        <ProtectedRoute userInfo={userInfo}>
                            <AllCompoundsContainer
                                userInfoStore={userInfoStore}
                                columnsConfigStore={compoundsColumnsConfigStore}
                                compoundsColumnsConfigStore={compoundsColumnsConfigStore}
                                title="All Compounds"
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/similar/:compoundNumber"
                    element={
                        <ProtectedRoute userInfo={userInfo}>
                            <AllCompoundsContainer
                                isSimilarityView
                                userInfoStore={userInfoStore}
                                columnsConfigStore={similarityColumnsConfigStore}
                                compoundsColumnsConfigStore={compoundsColumnsConfigStore}
                                title="Similar Compounds"
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/help"
                    element={
                        <ProtectedRoute userInfo={userInfo}>
                            <HelpCenter compoundsStore={compoundsStore} userInfoStore={userInfoStore} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute userInfo={userInfo} adminOnly>
                            <ErrorBoundary>
                                <AdminPage userInfoStore={userInfoStore} />
                            </ErrorBoundary>
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Footer />
        </div>
        </ErrorBoundary>
    )
}

export default App
