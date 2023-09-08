
import { LuLayoutDashboard } from 'react-icons/lu'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { BsBookmark } from 'react-icons/bs'
import { LiaStarSolid, LiaCommentSolid } from 'react-icons/lia'
import logo from '../assets/img/logo.png'
import sort from '../assets/img/sort.svg'
import searchIcon from '../assets/img/search.svg'
import ProfileProductsList from '../components/ProfileProductsList'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Settings from '../components/Settings'
import ProfilePage from '../components/ProfilePage'
import { logoutUser } from '../Reducers/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../Reducers/userReducer'
import { useNavigate } from 'react-router-dom';

function Profile() {
  const currentUser = useSelector((state) => state.user);
  const [sortFilter, setSortFilter] = useState(false);
  const loading = useSelector((state) => state.user.loading);
  const [userApps, setUserApps] = useState(currentUser.products?.data?.following_app)
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showOverlay, setShowOverlay] = useState(false);
  const [sortList, showSortList] = useState(false);
  const [user, setUser] = useState(currentUser.products?.data)
  const [searchVal, setSearchVal] = useState('')
  const [savedApps, setSavedApps] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('option1');
  const [sortText, setSortText] = useState('Sort by');
  // const {id} = useParams()
  const id = localStorage.getItem('userId')

  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  const handleLogout = () => {
    window.location.reload();
    dispatch(logoutUser());
    navigate('/');
 
  };


  const handleSortClick = () => {
    showSortList(!sortList);
    setShowOverlay(true);
  }
  const handleOverlayDoubleClick = () => {
    setShowOverlay(false);
  };
  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };
  const calculateAverageRating = (appData) => {
    const  rating  = appData.rating;
    // Calculate the average rating based on the individual ratings
    const totalRatings = Object.values(rating).reduce((sum, value) => sum + value, 0);
    const numberOfRatings = Object.keys(rating).length;
    const averageRating = totalRatings / numberOfRatings;
    return averageRating;
  };

  const handleSortToggle = (type) => {
    // console.log(userApps
    setShowOverlay(false)
    // const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    // setSortOrder(newSortOrder);
    if (type === 'latest') {
      setSortText('Latest');
      var sortedItems = [...userApps].sort((a, b) => {
        var dateA = new Date(a.subscription.date);
        var dateB = new Date(b.subscription.date);
        return dateA - dateB;
    })
    // console.log(sortedItems)
    setUserApps(sortedItems);
    console.log(userApps)
    } else if (type === 'oldest') {
      setSortText('Oldest');
      var sortedItems = [...userApps].sort((a, b) => {  
        var dateA = new Date(a.subscription.date);
        var dateB = new Date(b.subscription.date);
        return dateB - dateA;
    })
    // console.log(sortedItems)
    setUserApps(sortedItems);
    console.log(userApps)
   
  }
  if (type === 'highest') {
    setSortText('Highest');
    const sortedItems = [...userApps].sort((a, b) => {
      const averageRatingA = calculateAverageRating(a.obj_id);
      const averageRatingB = calculateAverageRating(b.obj_id);
      return averageRatingB - averageRatingA;
    });
    setUserApps(sortedItems);
  } if (type === 'lowest') {
    setSortText('Lowest');
    const sortedItems = [...userApps].sort((a, b) => {
      const averageRatingA = calculateAverageRating(a.obj_id);
      const averageRatingB = calculateAverageRating(b.obj_id);
      return averageRatingA - averageRatingB;
    });
    setUserApps(sortedItems);
  }
  setSortFilter(true)
}
  useEffect(() => {
    dispatch(fetchUser(id));
    // handleSortToggle('Latest')
  }, [user,dispatch, userApps,id]);
  
const AllUsers = () =>{
  setUserApps(currentUser.products?.data?.following_app)
  setUser(currentUser.products?.data)
  setSelectedFilter('All')
}

const handleFilterClick = (filter) => {
  if (filter === 'All') {
    AllUsers();
  } 
  if (filter === 'Comments'){
    filterComments()
  } if (filter === 'Status'){
    filterStatus()
  }
  if (filter === 'Ratings'){
    filterRatings()
  } if (filter === 'Saved'){
    filterSaved()
  }
  
  else {
    setSelectedFilter(filter); 
  }
};

const filterComments = () =>{
 const filterCommented = user?.following_app?.filter((i) => (i.subscription.comment.length > 0))
 setUserApps(filterCommented)
 setSelectedFilter('Comments')
}

const filterSaved = () =>{
  setUserApps(user?.saved)
  setSelectedFilter('Saved')
 }
 
const filterRatings = () =>{
  const filterRated = user?.following_app?.filter((i) => (i.obj_id.rating))
  setUserApps(filterRated)
  setSelectedFilter('Ratings')
 }

const filterStatus = () =>{
  if (selectedDropdownValue === 'option1'){
    const filterStatus = user?.following_app?.filter((i) => (i.status === 'I am using it 👍'))
    setUserApps(filterStatus)
  } if (selectedDropdownValue === 'option2'){
    const filterStatus = user?.following_app?.filter((i) => (i.status === 'Yes, i want to 🤩'))
    setUserApps(filterStatus)
  }
  if (selectedDropdownValue === 'option3'){
    const filterStatus = user?.following_app?.filter((i) => (i.status === 'May be 🤔'))
    setUserApps(filterStatus)
  }
  if (selectedDropdownValue === 'option4'){
    const filterStatus = user?.following_app?.filter((i) => (i.status === "No, I don't 😐"))
    setUserApps(filterStatus)
  }
  
 
  setSelectedFilter('Status')
 }

const handleDropdownChange = (event) => {
  const selectedValue = event.target.value;
  // setSelectedDropdownValue(selectedValue);
  // console.log(selectedValue)
  setSelectedDropdownValue(selectedValue)
};

const onHandleChange =(e)=>{
  setSearchVal(e.target.value)
  const filterSearch = user?.following_app?.filter((i) => (i.obj_id.name.toLowerCase().includes(searchVal.toLowerCase()) ))
  // console.log(filterSearch)
  setUserApps(filterSearch)
 }

 useEffect(() => {
  
  if(sortText== 'Latest' || sortText== 'Oldest' || sortText== 'Highest' || sortText== 'Lowest'){
    handleSortToggle(sortText)
    // setSortFilter(false)  
  // You can also set other state variables here based on the fetched data
}else if (!loading && currentUser.products) {
  setUserApps(currentUser.products?.data?.following_app);
  setSortText('Sort By')
    // You can also set other state variables here based on the fetched data
}
}, [loading, currentUser.products]);

// useEffect(() => {
//     if(sortText== 'Latest' || sortText== 'Oldest' || sortText== 'Highest' || sortText== 'Lowest'){
//       handleSortToggle(sortText)
//       // setSortFilter(false)  
//     // You can also set other state variables here based on the fetched data
//   }
// }, [sortText,handleSortToggle]);

  return (
    <div className="profile">
      <div className="sidebar">
        <Link to='/'> 
        <img src={logo} style={{ height:'50px'}}
        alt="" />
        </Link>
        <div   className={`icon ${activeComponent === 'dashboard' ? 'filter-selected' : ''}`}>

        <LuLayoutDashboard  
      
        onClick={() => handleSidebarClick('dashboard')} /> <p>Dashboard</p>
        </div>
        <div  className={`icon ${activeComponent === 'profilepage' ? 'filter-selected' : ''}`}>

        <HiOutlineUserCircle
        onClick={() => handleSidebarClick('profilepage')} /> <p>Profile</p>
        </div>
        <div  className={`icon ${activeComponent === 'settings' ? 'filter-selected' : ''}`}>
        <RiLogoutBoxRLine  
        onClick={() => handleLogout()} />
        <p>Logout</p>
        </div>
      
      </div>
{
 activeComponent === 'dashboard' && 
 <div className="main">
        <div className="top">
          <p>My Applications</p>
          <div className="search">
            <form>
              <input
              onChange={onHandleChange} 
              value={searchVal} 
                type="text"
                id="search"
                placeholder="Search"
                autoComplete="off"
              />
            </form>
            <div className="seach-icon">
              <img src={searchIcon} alt="" />
            </div>
          </div>
        </div>

        <div className="filters">
          <div className={`filter ${selectedFilter === 'All' ? 'selectedFilter' : ''}`}
            onClick={() => handleFilterClick('All')}
          >All</div>
          <div className={`filter ${selectedFilter === 'Status' ? 'selectedFilter' : ''}`}
            onClick={() => handleFilterClick('Status')}>
        <select id="dropdown" onChange={handleDropdownChange} value={selectedDropdownValue} >
        <option value="option1">I am using it</option>
        <option value="option2">Yes, I want to </option>
         <option value="option3">May be</option>
         <option value="option4">No, I don't </option>
        </select>
          </div>
          <div
          className={`filter ${selectedFilter === 'Ratings' ? 'selectedFilter' : ''}`}
          onClick={() => handleFilterClick('Ratings')}>⭐ My ratings</div>
          <div className={`filter ${selectedFilter === 'Comments' ? 'selectedFilter' : ''}`}
            onClick={() => handleFilterClick('Comments')}>💬 My comments</div>
          <div className={`filter ${selectedFilter === 'Saved' ? 'selectedFilter' : ''}`}
            onClick={() => handleFilterClick('Saved')}> <BsBookmark/> Saved</div>
        </div>

        <div className="sort" onClick={ handleSortClick}>
          <img src={sort} alt="" />
          <p>{sortText}</p>
        </div>
        {
          sortList && showOverlay &&
          (
            <div className="sort-overlay" onDoubleClick={handleOverlayDoubleClick}>
           <ul className='sort-list'>
          <li onClick={()=>handleSortToggle('latest')}>Latest</li>
          <li  onClick={()=>handleSortToggle('oldest')}>Oldest</li>
          <li onClick={()=>handleSortToggle('highest')}>Highest</li>
          <li onClick={()=>handleSortToggle('lowest')} >Lowest</li>
        </ul>
          </div>
          )
          
        }
    
{
   <ProfileProductsList userApps={userApps} id={id}/>
}
       
      </div>
}

  {activeComponent === 'profilepage' && <ProfilePage/>}  
  {/* {activeComponent === 'settings' && <Settings user={user}/>} */}
      
    </div>
  );
}

export default Profile