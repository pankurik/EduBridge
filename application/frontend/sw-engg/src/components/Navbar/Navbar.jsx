import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Menu, MenuItem, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import theme from '../../theme'; // Make sure this path is correct
import logo from '../../images/eduBridge.webp';
import backgroundImage from '../../images/Backgroundimage.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch, faBook, faCloudUploadAlt, faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import { Dropdown, DropdownMenuItem, DropdownNestedMenuItem } from "./Dropdown";
import apiService from "../../services/apiService";
import { TabContext } from '../context/TabContext';
import { SearchContext } from '../context/SearchContext';

function Navbar(props) {
    const { searchTerm, setSearchTerm } = useContext(SearchContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const userRole = sessionStorage.getItem('role');
    const firstName = sessionStorage.getItem('firstName'); // Fetching firstName from sessionStorage
    const lastName = sessionStorage.getItem('lastName'); // Fetching lastName from sessionStorage
    const navigate = useNavigate();
    const homePath = '/landingPage';
    const [courses, setCourses] = useState([]);
    const { activeTab } = useContext(TabContext);

    useEffect(() => {
        console.log(`Active Tab in Navbar: ${activeTab}`);
    }, [activeTab]);

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        if (activeTab === 'tab1') {
            if (searchTerm.trim()) {
                navigate(`/search-results?search=${encodeURIComponent(searchTerm)}`);
            }
        } else if (activeTab === 'tab2') {
            try {
                const results = await apiService.searchDiscussions(searchTerm);
                console.log(`Search results for "${searchTerm}":`, results);
            } catch (error) {
                console.error('Error searching discussions:', error);
            }
        }
    };

    const handleNavigateMyDiscussions = () => {
        handleClose();
        navigate('/my-discussions');
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getInitials = (firstName, lastName) => {
        return firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : 'U';
    };

    const openDiscussionModal = () => {
        console.log("Toggle clicked");
        props.toggleModal();
        props.modalTypeFunc('Discussions');
    };

    const openFileUploadModal = () => {
        console.log("Toggle clicked");
        props.toggleModal();
        props.modalTypeFunc('File-Upload');
    };

    const buttonStyle = {
        fontWeight: 'bold',
        borderRadius: '50px',
        textTransform: 'none',
        fontSize: '16px',
        padding: '8px 32px',
        margin: '0 4px', // Add space around the buttons
        display: 'flex', // Ensure button content is displayed as flex
        alignItems: 'center', // Align button content vertically
        gap: '8px', // Add space between icon and text
        color: 'white',
        whiteSpace: 'nowrap',
    };

    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                const fetchedCourses = await apiService.fetchCourses();
                if (fetchedCourses) {
                    setCourses(fetchedCourses);
                    console.log(fetchedCourses);
                } else {
                    console.log("No courses fetched, check API and response structure");
                    setCourses([]);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                setCourses([]);
            }
        };

        fetchCoursesData();
    }, []);

    const defaultMenu = [<DropdownMenuItem key="none">No Courses Available</DropdownMenuItem>];
    const buildMenuItems = (courses) => {
        return courses.map(course => {
            if (course.children && course.children.length > 0) {
                return <DropdownNestedMenuItem
                    key={course.id}
                    label={course.name}
                    menu={buildMenuItems(course.children)}
                />;
            } else {
                return <DropdownMenuItem key={course.id}>{course.name}</DropdownMenuItem>;
            }
        });
    };

    const courseMenuItems = buildMenuItems(courses);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            backgroundColor: 'background.paper',
            color: 'text.primary',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
        }}>
            <Link to={homePath} style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                marginLeft: 16
            }}>
                <Avatar sx={{ width: 75, height: 75 }}>
                    <img src={logo} alt="App Logo" style={{ width: '100%' }} />
                </Avatar>
            </Link>

            {userRole?.toLowerCase() !== 'admin' && (
                <form onSubmit={handleSearchSubmit}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search Files"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                borderRadius: '20px',
                                backgroundColor: 'white',
                                width: '500px',
                                flexGrow: 1,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' },
                                }
                            }}
                            InputProps={{
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setSearchTerm('')}
                                            edge="end"
                                            sx={{ size: "0x", color: '#005B4B' }}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button type="submit" color="inherit" sx={{
                            p: 0,
                            minWidth: 'auto',
                            backgroundColor: 'transparent',
                            ml: 1,
                            '&:hover': { backgroundColor: 'transparent' }, // Ensure no background change on hover
                            '&:focus': { outline: 'none' } // Remove focus outline
                        }}>
                            <FontAwesomeIcon icon={faSearch} size="lg" style={{ color: 'white' }} />
                        </Button>
                    </Box>
                </form>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {userRole?.toLowerCase() === 'instructor' && (
                    <Button onClick={openFileUploadModal} sx={buttonStyle}>
                        <FontAwesomeIcon icon={faCloudUploadAlt} size="sm" />
                        <Typography variant="body1">Upload New Content</Typography>
                    </Button>
                )}
                {userRole?.toLowerCase() !== 'admin' && (
                    <>
                        <Button onClick={openDiscussionModal} sx={buttonStyle}>
                            <FontAwesomeIcon icon={faPlus} size="sm" />
                            <Typography variant="body1">Create Discussion</Typography>
                        </Button>
                        <Dropdown
                            trigger={<Button sx={buttonStyle}>
                                <FontAwesomeIcon icon={faBook} size="sm" />
                                <Typography variant="body1">Courses</Typography>
                            </Button>}
                            menu={courseMenuItems}
                        />
                    </>
                )}
                <Button onClick={handleClick} sx={buttonStyle}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 50, height: 50, alignItems: 'right', marginLeft: -16, marginRight: -16 }}>
                        {getInitials(firstName, lastName)}
                    </Avatar>
                </Button>
                <Menu
                    className='menu-box'
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'account-button',
                    }}
                    PaperProps={{
                        style: {
                            width: '300px', // Increase the width as needed
                            padding: '20px',  // Optional: add some padding around the items
                            paddingBottom: '0px'
                        }
                    }}
                >
                    <div className='name-box'>
                        <div>
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 60,  // Increased width
                                    height: 60, // Increased height
                                }}
                            >
                                {getInitials(firstName, lastName)}
                            </Avatar>
                        </div>
                        <div>
                            <div className='name-text'>
                                <div className='firstName'>{sessionStorage.getItem("firstName")}</div>
                                <div className='lastName'>{sessionStorage.getItem("lastName")}</div>
                            </div>
                            <div>
                                {sessionStorage.getItem('userEmail')}
                            </div>
                            <div>
                                {userRole && (
                                    <div>
                                        {userRole[0].toUpperCase() + userRole.substring(1)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <MenuItem onClick={handleNavigateMyDiscussions}>
                        My Discussions
                    </MenuItem>
                    <MenuItem onClick={handleLogout} className='logout-text'>
                        <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

export default Navbar;

