import { LiaCommentSolid } from 'react-icons/lia'
import StarRating from '../components/StarRating'
import product from '../assets/img/product-image.png'
import LoginPopup from '../components/LoginPopup'
import { FaBookmark, FaGlobe } from 'react-icons/fa';
import { useParams } from 'react-router'
import { useEffect, useState } from "react"
import SimilarList from '../components/SimilarList'
import Spinner from '../components/Spinner'
import { useSelector } from 'react-redux';
import CommentPopup from '../components/CommentPopup'
import RatingPopup from '../components/RatingPopup'
import ReactionComponent from '../components/ReactionComponent'
import { selectUser } from '../Reducers/userReducer'
import { Link } from 'react-router-dom'
import HurryUp from '../components/HurryUp'
import RegisterPopup from '../components/RegisterPopup'
function Product() {
    const{ slug } = useParams()
    const user = useSelector(selectUser)
    const [singleProduct, setSingleProduct] = useState([])
    var input_string = slug
    var output_string = input_string.replace(/-/g, " ")
    const [loading, setLoading] = useState(true);
    const [showOverlay, setShowOverlay] = useState(false);
    const auth = useSelector((state) => state.auth)
    const [similar, setSimilar] = useState([])
    const [hurryUpPopup, setHurryUpPopup] = useState(false);
    const [loginPopup, setLoginPopup] = useState(false);
    const [registerPopup, setRegisterPopup] = useState(false);
    const [loginPopupOpen, setLoginPopupOpen] = useState(false);
    const [commentPopupOpen, setCommentPopupOpen] = useState(false);
    const [ratingPopupOpen, setRatingPopupOpen] = useState(false);
    const [followingAppRating, setFollowingAppRating] = useState([])
    const [isFollowing, setIsFollowing] = useState(false)
    const [followingAppComments, setFollowingAppComments] = useState([])
    const [followingAppCommentList, setFollowingAppCommentList] = useState([])
    const [currentStatus, setCurrentStatus] = useState('')
    useEffect(()=>{
      
      const apiUrl = 'https://appsalabackend-p20y.onrender.com/products'
      const fetchData = async() =>{
        const response = await fetch(apiUrl)
        const data = await response.json()
        const foundProducts = data.data.filter((product) => product.slug === slug);
        setSingleProduct(foundProducts)
        setSimilar(data.data.filter((product) => product?.Category === singleProduct[0]?.Category))
        setLoading(false)
      }
      if (auth.isAuthenticated) {
        var app = user?.products?.data?.following_app 
        var following_app = app?.find((app)=> app?.obj_id?._id === singleProduct[0]?._id)
        if(following_app){
            setIsFollowing(true)
            setFollowingAppRating(following_app?.subscription?.user_ratings[0]?.rating)
            setFollowingAppCommentList(following_app?.subscription?.comment)
            setFollowingAppComments(following_app)
            setCurrentStatus(following_app?.status)
        }if(!following_app){
            setFollowingAppComments(singleProduct[0])
        }
      }
        fetchData()
      }, [setIsFollowing , auth.isAuthenticated,singleProduct, user?.products?.data?.following_app, singleProduct[0]?._id, followingAppRating, followingAppCommentList, followingAppComments, currentStatus, slug]);

    const handlePopup = () => {
      if(!auth.isAuthenticated){
          setShowOverlay(true)
       setHurryUpPopup(true)
      }else{
          setShowOverlay(true)
          setLoginPopupOpen(false)
          setCommentPopupOpen(true)
      }
    }
    const handleLoginPopup = () => {
      if(!auth.isAuthenticated){
          setShowOverlay(true)
       setHurryUpPopup(true)
      }
    }
    const handleRatingPopup = () => {
      if(!auth.isAuthenticated){
          setShowOverlay(true)
       setHurryUpPopup(true)
      }else{
          setShowOverlay(true)
          setLoginPopupOpen(false)
          setCommentPopupOpen(false)
          setRatingPopupOpen(true)
      }
    }
   

      const handleOverlayDoubleClick = () => {
        setShowOverlay(false);
      };
    const handleSave = async() =>{
      if(!auth.isAuthenticated){
        setShowOverlay(true)
        setLoginPopupOpen(true)
    }else{ 
      const authToken = localStorage.getItem('access_token')
      const api = `https://appsalabackend-p20y.onrender.com/saved_product/${singleProduct[0]?._id}`
      const requestOptions = {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: '',
      };
      console.log(requestOptions)
      try {
        const response = await fetch(api, requestOptions);
        const data = await response.json();
        // setSelectedRatings(currentRatings)
        console.log('Response data:', data);
        // Handle the response data here
      } catch (error) {
        console.error('Error:', error);
        // Handle errors here
      }
    }
    }
    //   setSimilar(similar[0])
    if(followingAppRating){
        
      var rating = followingAppRating
      
      var ratingValues = Object.values(rating);
      var totalValues = ratingValues.length;
      
      var sum = ratingValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      var average = sum / totalValues;
      
    }else{
       average = 0
    }
    // console.log(singleProduct[0])

    const website = `http://${singleProduct[0]?.sellerDetails?.companyWebsite}`
    if (loading) {
      return <Spinner />;
    }

    if(!singleProduct[0]){
      return <h2>Product not found</h2>
    }
  return (
    <>
       {showOverlay && hurryUpPopup && (
        <div className="overlay" onDoubleClick={handleOverlayDoubleClick}>
          <HurryUp setHurryUpPopup={setHurryUpPopup} setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} />
        </div>
  )}
{showOverlay && loginPopup && (
        <div className="overlay" onDoubleClick={handleOverlayDoubleClick}>
          <LoginPopup/>
        </div>
  )}
  {showOverlay && registerPopup && (
        <div className="overlay" onDoubleClick={handleOverlayDoubleClick}>
          <RegisterPopup setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} />
        </div>
  )}
   {showOverlay && commentPopupOpen && (
        <div className="overlay" onDoubleClick={handleOverlayDoubleClick}>
          <CommentPopup info={followingAppComments}/> 
        </div>
  )}
    {showOverlay && ratingPopupOpen &&  (
        <div className="overlay" onDoubleClick={handleOverlayDoubleClick}>
          {
          followingAppComments ?
          <RatingPopup info={followingAppComments} setRatingPopup={setRatingPopupOpen} /> : <></>
        }
         
        </div>
  )}

    <div>
    <p className="page-path">Home / {output_string}</p>
      <header className="product-page-header container"> 
        <div className='product-info-grid'>
          <div className='product-information'>
          <img src={singleProduct[0]?.logo} alt=""/>
          <div>
          <h3>{singleProduct[0]?.name}</h3>
          <StarRating rating={singleProduct[0]?.averageRating} isDisabled ={true}/> 
           <p>749  Follows</p>
          </div>
          </div>
        
    <div className='product-information-2'>
    <p className='review'>{singleProduct[0]?.review}</p>
    <div className='comment-rating'>
            <div className='my-rating'  onClick={handleRatingPopup}>
                <p>My Rating </p> 
                {
                isFollowing ? <StarRating rating={average}/> : <StarRating isDisabled ={true}/>
                }
            </div>
   
        <div className='my-comments'  onClick={handlePopup}>
        <LiaCommentSolid/>
        {
            isFollowing ? 
            <p>comment <span style={{color: '#00A82D'}}>({followingAppCommentList?.length})</span></p>
             : <p className='no-comment' onClick={handlePopup}>Comment</p>
        }
        </div>
        </div>
    <div>
                <button type= "btn-light" className='button' onClick={handleSave} disabled={isFollowing} > <FaBookmark className='icon'/>
                {
                  isFollowing ? <span>Saved</span> : <span>Save</span>
                }
                 </button>
                <button type= "btn-dark" className='button'> <Link to={website} className='button-link' target="_blank"> <FaGlobe className='icon'/> Visit Web </Link></button>
             </div>
    </div>
             
        </div>
        <div className="product-question">
            <p className="question">What is {singleProduct[0]?.name}?</p>
            <p style={{color: "#454545"}}>{singleProduct[0]?.shortDescription} </p>
        </div>
        <div className="product-bar" onClick={handleLoginPopup}>
            <p>Do you wish to use {output_string}?
            </p>            
            <ReactionComponent currentStatus={currentStatus} product={singleProduct[0]}/>
        </div>
    </header>
    <p className="highlighted">Productivity</p>
    <div className="image-section container">
        <img src={product} alt=""/>
    </div>

    <div className="product-review-section container">
        <p className="bold">Review</p>
            
{
  singleProduct[0]?.review
}

    </div>

<div className="alternatives">
    <div className="container" style={{width:"60%"}}>
    <h1 className="heading">Similar Products / Alternatives</h1>
    </div>
        
{

loading ? <Spinner/> :
similar ? (
  <SimilarList similar={similar} key={similar._id}/> 
):  
<Spinner/> 
   
}
</div>
</div>


<div className="product-review-section container">
    <p>In-Depth Analytics:</p>

<p>Understanding channel performance is pivotal for content creators seeking to refine their content strategy. TubeBuddy's analytics suite offers comprehensive insights into various performance metrics, including views, watch time, subscriber growth, audience demographics, and more. By utilizing these data-driven insights, content creators can make informed decisions about their content direction, allowing them to cater to their audience's preferences effectively.</p>

<p>The analytical tools also allow for historical data tracking, which is vital for identifying long-term trends and seasonal patterns in viewership. Creators can observe their channel's growth over time, aiding them in setting realistic goals and tracking progress towards milestones. TubeBuddy's analytics go beyond the basic YouTube Studio metrics, providing a more robust and detailed view of channel performance.</p>

<p>Time-Saving Bulk Processing:</p>

<p>Managing a YouTube channel often involves handling a significant number of videos, which can be time-consuming and repetitive. TubeBuddy's bulk processing tools come to the rescue, offering a range of actions that can be applied to multiple videos simultaneously. From updating video cards and annotations to changing privacy settings, these batch updates save creators valuable time, enabling them to focus on content creation and other aspects of channel growth.</p>

<p>Content creators with vast video libraries benefit greatly from these features, as they can efficiently maintain and optimize their entire content catalog without individually editing each video. This feature is especially valuable for seasoned creators and businesses with extensive video libraries.</p>

<p>Competitor Analysis:</p>

<p>Staying ahead of the competition is a constant challenge in the dynamic YouTube ecosystem. TubeBuddy's competitor analysis feature provides creators with an edge by offering insights into competitors' strategies, keywords, and video performance. This powerful tool allows users to identify popular keywords and trends that competitors are leveraging successfully, enabling them to tailor their content and maximize their reach.</p>

<p>Furthermore, the feature allows users to compare their own performance with that of their competitors, offering valuable benchmarks for improvement. By understanding the strengths and weaknesses of competitors, content creators can identify opportunities and refine their content to stand out in their niche.</p>

<p>Engagement and Promotion:</p>

<p>Building a loyal and engaged community is essential for the sustained growth of a YouTube channel. TubeBuddy facilitates this process through its suite of engagement and promotion tools. Creators can efficiently interact with their audience, respond to comments, and thank subscribers, fostering a stronger sense of connection and loyalty.</p>

<p>Additionally, the platform offers seamless integration with popular social media platforms, allowing creators to promote their videos and channel across multiple channels effortlessly. The ability to cross-promote content increases visibility and drives traffic to the channel, contributing to audience growth and video performance.</p>



</div>
<div className="pros-cons container">
    <p className="bold" style={{color:"#00A82D"}}>Positive</p>
    <p>The economy plan offered by GoDaddy.com provides essential services for most users, and is a great plan to start a website with. You will find it easy to access the basic package, as designed for everyone.The economy plan offered by GoDaddy.com provides essential services for most users, and is a great plan to start a website with. You will find it easy to access the basic package, as designed for everyone.</p>
    <p className="bold" style={{color:"#FF1818"}}>Negative</p>
    <p>The economy plan offered by GoDaddy.com provides essential services for most users, and is a great plan to start a website with. You will find it easy to access the basic package, as designed for everyone.The economy plan offered by GoDaddy.com provides essential services for most users, and is a great plan to start a website with. You will find it easy to access the basic package, as designed for everyone.</p>
    <p className="bold">Conclusion</p>
    <p>The economy plan offered by GoDaddy.com provides essential services for most users, and is a great plan to start a website with. You will find it easy to access the basic package, as designed for everyone.The economy plan offered by GoDaddy.com provides essential services for most users, and is a great plan to start a website with. You will find it easy to access the basic package, as designed for everyone.</p>
</div>

</>




  )
}

export default Product