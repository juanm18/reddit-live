import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

function Reddit () {
  const [posts, setPosts] = React.useState([]);
  const [originalPostList, setOriginalPostList] = React.useState([]);
  const [isSorted, setIsSorted] = React.useState(false);
  const pageFilter = 10;
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  React.useEffect(() => {
    console.log("hitting");
    axios.get(`https://www.reddit.com/r/reactjs.json`).then(response => {
        const newPosts = response.data.data.children.map(obj => obj.data);
        setOriginalPostList(newPosts);
        paginateList(currentPage, newPosts);
        getTotalPages(newPosts);
    });
  }, []);

  function sortList () {
    posts.sort(function(a, b) {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    });
    setPosts(posts);
    setIsSorted(!isSorted);
  }

  function unsortList () {
    var newList = posts.sort(() => Math.random() - 0.5);
    setPosts(newList);
    setIsSorted(!isSorted);
  }

  function paginateList(pageNum, posts = false) {
    if (posts == false) {
      var postList = originalPostList.slice(pageNum * pageFilter, (pageNum * pageFilter) + pageFilter );
    }else {
      var postList = posts.slice(pageNum * pageFilter, (pageNum * pageFilter) + pageFilter );
    }
    setPosts(postList);
  }

  function getTotalPages (posts) {
    // total pages for pagination
    var total_pages = Math.ceil(posts.length / pageFilter);
    setTotalPages(total_pages);
  }

  function nextPage (pageNum) {
    paginateList(pageNum);
    setCurrentPage(pageNum);
  }

  function previousPage (pageNum) {
    paginateList(pageNum);
    setCurrentPage(pageNum);
  }

  return (
    <Container id='container'>
      <div id='title-button'>
        <Jumbotron>
          <h1 id='title'>Reddit Post App</h1>
        </Jumbotron>
        <div id='sort-button-container'>
          <Button id='sort-button' onClick={!isSorted ? () => sortList() : () => unsortList() }>{isSorted ? "Unsort" : "Sort"}</Button>
        </div>
      </div>

      <div id='list-container'>
        <ul id='post-list'>
          {posts.map(post => {
            return (
              <li key={post.id}>
                <p>Title: <a href={post.url}>{post.title}</a></p>
                <p>Author: {post.author}</p>
              </li>
            );
          })
        }
        </ul>
      </div>
      <div id='controls-container'>
        <span> { currentPage < totalPages - 1 ? <Button variant='secondary' className='btn-1' onClick={() => nextPage(currentPage + 1)}>Next</Button> : null} </span>
        <span> { currentPage + 1} of {totalPages} </span>
        <span> { currentPage > 0 ? <Button variant='secondary' className='btn-2' onClick={() => previousPage(currentPage - 1)}>Previous</Button> : null } </span>
      </div>
    </Container>
  );
}


ReactDOM.render(<Reddit />, document.getElementById('root'));
