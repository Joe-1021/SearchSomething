import { useEffect, useRef, useState } from 'react';
import './App.css'


const api = 'https://api.unsplash.com/search/photos/';
const accessKey = 'GAvxZ9VesndxTx_9NftqgOtZffnTB0YhfGiWGDJA-bs';

//component start
const SearchBar = ({search,setSearch,handleSearch})=>{
  return(
    <div className="searchBar d-flex justify-content-between align-items-center ">
          <label htmlFor="search">搜尋</label>
            <input type="search" id='search' className='form-control w-75' value={search} onChange={(e)=>{
                setSearch(e.target.value)
            }}/>
            <button type='button' className='btn btn-secondary' onClick={handleSearch}>搜尋</button>
        </div>
  )
}

const Card = ({data,getSinglePhoto})=>{
  return(
    <a href="#" className="card" style={{cursor:'zoom-in'}} onClick={(e)=>{
        e.preventDefault();
        getSinglePhoto(data.id)
    }}>
        <img src={data.urls.raw} width="100%" height="400px" style={{objectFit:"cover"}} alt="..." />
    </a>
  )
}

const Pagination = ({previousPage,nextPage,currentPage})=>{
  return(
    <nav aria-label="Page navigation ">
      <ul className="pagination">
        <li className="page-item previousPage"><a href="#" className="page-link" onClick={previousPage}>Previous</a></li>
        <p className='mb-0'>第 {currentPage.current} 頁</p>
        <li className="page-item nextPage"><a href="#" className="page-link" onClick={nextPage}>Next</a></li>
      </ul>
    </nav>
  )
} 

const Loading = ({isLoading})=>{
  return(
    <div className="loading" style={{display : isLoading ? 'flex':'none' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  )
}

const Modal =({modalRef,photoUrl})=>{
  return(
    <div className="modal" tabIndex="-1" ref={modalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
            <button type="button" className="btn-close" style={{position:'absolute', top:0, right:0, padding:'10px'}} data-bs-dismiss="modal" aria-label="Close"></button>
            <img src={photoUrl} alt="" width='100%'/>
        </div>
      </div>
    </div>
  )
}


function App() {
  const [search,setSearch]=useState('animals');
  const [searchRes,setSearchRes]=useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const currentPage = useRef(1);
  const modalRef = useRef(null);
  const myModal = useRef(null);
  const [photoUrl,setPhotoUrl]=useState('')

  function handleSearch(){
    if(search ===''){
      return
    }
    getPhotos(1)
  }

  const getPhotos = async(page=1)=>{
    setIsLoading(true)
    try {
      const res = await axios.get(`${api}?client_id=${accessKey}&query=${search}&page=${page}`);
      console.log(res.data.results)
      setSearchRes(res.data.results);
      currentPage.current = page
      setTimeout(() => {
        setIsLoading(false)
      }, 1000);
      
    } catch (error) {
      console.log(error)
    }
  }

  const getSinglePhoto = async(id)=>{
    const singlePhotoApi='https://api.unsplash.com/photos/';
    try {
      const res = await axios.get(`${singlePhotoApi}${id}?client_id=${accessKey}`);
      setPhotoUrl(res.data.urls.regular);
      myModal.current.show();
      const modal = document.querySelector('.modal');
      modal.style.display='flex';
      modal.style.alignItems='center'
    } catch (error) {
      console.log(error);
    }
    
  }
  
  useEffect(()=>{
    getPhotos(1)
  },[]);

  useEffect(()=>{
    const body =document.querySelector('body');
    if(isLoading){
      body.style.overflow='hidden'
    }else{
      body.style.overflow='auto'
    }
  },[isLoading]);


  useEffect(()=>{
    const previousPage = document.querySelector('.previousPage');
    const nextPage = document.querySelector('.nextPage');
    if(currentPage.current ===1){
      previousPage.classList.add('disabled')
    }else{
      previousPage.classList.remove('disabled')
    }
  },[currentPage.current])

  useEffect(()=>{
    myModal.current = new bootstrap.Modal(modalRef.current);
    
  },[])

  function previousPage(){
    if(search === ''){
      return
    }
    if(currentPage.current < 1){
      currentPage.current = 1
    }else{
      currentPage.current --
    }
    
    getPhotos(currentPage.current)
  }

  function nextPage(){
    if(search === ''){
      return
    }
    currentPage.current ++
    getPhotos(currentPage.current)
  }

  return (
    <>
   
    <div className="container">
        <Loading isLoading={isLoading}/>
        <SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch}/>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3  g-3 my-3">
          {searchRes.map((data)=>{
            return(
              <div className="col" key={data.id}>
                <Card data={data} getSinglePhoto={getSinglePhoto}/>
              </div>
            )
          })}
        </div>
        <Pagination previousPage={previousPage} nextPage={nextPage} currentPage={currentPage}/>
    </div>
    
    <Modal modalRef={modalRef} photoUrl={photoUrl}/>
      
    </>
  )
}



export default App
