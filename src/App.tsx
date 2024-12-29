import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import './App.css'
import './scroll.css'

function App() {

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [isSubmitVisible, setIsSubmitVisible] = useState(false);
  const [titles, setTitles] = useState<Array<any>>();
  const [currentTitle, setCurrentTitle] = useState("");
  const [isRecentlySubmitted, setIsRecentlySubmitted] = useState(false);

  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = async () => {
    try {
      const response = await fetch('https://tymursoroka.eu.pythonanywhere.com/api/titles/');
      const data = await response.json();
      setTitles(data);
    } catch (err) {
      console.log(err)
    }
  };

  const addTitle = async () => {
    console.log(currentTitle)
    const titleData = {
      title: currentTitle,
    };
    try {
      const response = await fetch('https://tymursoroka.eu.pythonanywhere.com/api/titles/create', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(titleData),
      }) 
      const data = await response.json()
      setTitles((prev: any) => [...prev, data])
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    setIsRecentlySubmitted(true);
    addTitle();
  };

  // Handler to check the span's content
  const handleInput = (event: any) => {
    const content = event.target.textContent.trim();
    setIsSubmitVisible(content !== '...');
    setCurrentTitle(event.target.textContent);
  };

  const handleOK = () => {
    setIsRecentlySubmitted(false)
  }

  const capitalise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <div className='scroll-container top'>
        <div className='scroll-text-top'>You are to choose the name of the performance. 
          Вам обирати назву перфомансу. Start typing by removing the ellipsis. 
          Впишіть що завгодно в поле між лапками.</div>
      </div>

      <div className='scroll-container left'>
      {isMobile ? (
          <div className='scroll-text-left'>
          {titles ? titles.map((t) => (
              capitalise(t.title) + ", "
            )) : null}
          </div>
      ) : (
          <div className='scroll-text-left'>
          {titles ? titles.map((t) => (
              <p>{capitalise(t.title)}</p>
            )) : null}
          </div> 
      )
      }
      </div>

      <div id='maindiv'>
        <h1 className='noname'>”</h1>
        <span className='noname' contentEditable="true" onInput={(e) => handleInput(e)}>...</span>
        <h1 className='noname'>”</h1>
        {/* Conditional rendering for the Submit button */}
        {isSubmitVisible && (
          <div className='submit-container'>
            <button className='submit-button' onClick={handleSubmit}>Submit</button>
          </div>
      )}
      </div>

      <div className='scroll-container right'>
      {isMobile ? (
        <div className='scroll-text-right'>
          {titles ? titles.map((t) => (
            capitalise(t.title) + ", "
          )) : null}
        </div>
      ) : (
        <div className='scroll-text-right'>
          {titles ? titles.map((t) => (
            <p>{capitalise(t.title)}</p>
          )) : null}
        </div>
      )
      }
      </div>

      <div className='scroll-container bottom'>
        <div className='scroll-text-bottom'>You are to choose the name of the performance. 
          Вам обирати назву перфомансу. Start typing by removing the ellipsis. 
          Впишіть що завгодно в поле між лапками.</div>
      </div>
      
      {isRecentlySubmitted ? 
        <div className='notification'>
          <div className='notification-content'>
            Your title has been saved. Ваша назва збережена.
            <button className='ok' onClick={handleOK}>OK</button>
          </div> 
        </div> : null}
        
    </>

  )
}

export default App
