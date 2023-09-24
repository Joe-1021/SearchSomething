import { useEffect, useRef, useState } from 'react';
import './App.css'


const api = 'https://api.unsplash.com/search/photos/';
const accessKey = 'GAvxZ9VesndxTx_9NftqgOtZffnTB0YhfGiWGDJA-bs';

function App() {
  const [search,setSearch]=useState('animals');
  const [searchData,setSearchData]=useState('')
  const [searchRes,setSearchRes]=useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const currentPage = useRef(1)

  const getPhotos = async(search,page=1)=>{
    setIsLoading(true)
    try {
      const res = await axios.get(`${api}?client_id=${accessKey}&query=${search}&page=${page}`);
      setSearchRes(res.data.results);
      currentPage.current = page
      setTimeout(() => {
        setIsLoading(false)
      }, 1000);
      
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(()=>{
    getPhotos(search,1)
  },[searchData]);

  function Previous(e){
    if(currentPage.current === 1){
      return
    }
    currentPage.current --
    getPhotos(search,currentPage.current)
  }

  function Next(e){
    currentPage.current ++
    getPhotos(search,currentPage.current)
  }

  return (
    <>
    <div className="loading" style={{display : isLoading ? 'flex':'none' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
    </div>
    <div className="container">
        <div className="searchBar d-flex justify-content-between align-items-center ">
          <label htmlFor="search">搜尋</label>
            <input type="search" id='search' className='form-control w-75' defaultValue={search} onChange={(e)=>{
                setSearch(e.target.value)
            }}/>
            <button type='button' className='btn btn-secondary' onClick={()=>{
              setSearchData(search)
              getPhotos(search)
            }}>搜尋</button>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3  g-3 my-3">
          {searchRes.map((data)=>{
            return(
              <div className="col" key={data.id}>
                <a className="card" style={{cursor:'zoom-in'}}>
                    <img src={data.urls.raw} width="100%" height="400px" style={{objectFit:"cover"}} alt="..." />
                </a>
              </div>
            )
          })}
        </div>
 
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item" ><a className="page-link" onClick={Previous}>Previous</a></li>
            <p className='mb-0'>第 {currentPage.current} 頁</p>
            <li className="page-item"><a className="page-link" onClick={Next}>Next</a></li>
          </ul>
        </nav>
        
    </div>
    
      
    </>
  )
}



export default App
