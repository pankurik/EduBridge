import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Signup from './components/signup/Signup';
import InstructorLandingPage from "./components/Landing/InstructorLanding/InstructorLandingPage";
import AdminPage from "./components/Landing/Admin/AdminPage";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/footer";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import MyDiscussions from './components/DiscussionForum/MyDiscussions';
import CoursesPage from "./components/CoursesPage/CoursesPage";
import FileDetails from "./components/Files/FileDetails";
import SearchResultsPage from "./components/Search/SearchResultsPage";
import { TabProvider } from './components/context/TabContext';
import { SearchProvider } from './components/context/SearchContext';
import DiscussionForum from "./components/DiscussionForum/DiscussionForum";
import DiscussionDetail from "./components/DiscussionForum/DiscussionDetail";
import DiscussionList from "./components/DiscussionForum/DiscussionList";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
    const [modalOpen, setModalState] = useState(false);
    const [modalType, setModalType] = useState("");

    const Layout = ({ children }) => {
        const location = useLocation();
        const hideNavbarAndFooterOnRoutes = ["/login", "/signup", "/forgot-password"];
        const showNavbarAndFooter = !hideNavbarAndFooterOnRoutes.includes(location.pathname);

        return (
            <>
                {showNavbarAndFooter && <Navbar toggleModal={() => setModalState(!modalOpen)} modalOpen={modalOpen} modalTypeFunc={(value) => setModalType(value)} />}
                <div>{children}</div> {/* Render children here */}
                {showNavbarAndFooter && <Footer />}
            </>
        );
    };

    return (
        <Router>
            <div className="app">
                <TabProvider>
                    <SearchProvider>
                        <Layout> {/* Render Layout component here */}
                            <Routes>
                                <Route path="/" element={<Navigate replace to="/login" />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/landingPage" element={
                                    <ProtectedRoute>
                                        <InstructorLandingPage toggleModal={() => setModalState(!modalOpen)} modalOpen={modalOpen} modalTypeFunc={(value) => setModalType(value)} modalType={modalType} />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin" element={<AdminPage />} />
                                {/* Discussion Forum routes */}
                                <Route path="/forum" element={<DiscussionForum />} />
                                <Route path="/discussions" element={<DiscussionList />} />
                                <Route path="/discussion/:id" element={<DiscussionDetail />} />
                                <Route path="/my-discussions" element={<MyDiscussions />} />
                                {/* Courses page route */}
                                <Route path="/courses" element={<CoursesPage />} />
                                <Route path="/files/:id" element={<FileDetails />} />
                                {/* Search Result page route */}
                                <Route path="/search-results" element={<SearchResultsPage />} />
                            </Routes>
                        </Layout>
                    </SearchProvider>
                </TabProvider>
            </div>
        </Router>
    );
}

export default App;
