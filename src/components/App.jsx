import React, { useState, useEffect, useCallback } from 'react';
import { Api } from '../Api/Api';
import toast, { Toaster } from 'react-hot-toast';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import LoaderSpin from './Loader';
import Modal from './Modal';
import { GlobalCSS } from './GlobalCSS';
import { Wrapper } from './Wrapper.jsx';

export const App = () => {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

  const perPage = 12;
  const totalPage = totalHits / perPage;

  const fetchImages = useCallback(async () => {
    try {
      setLoading(loading => !loading);
      await Api(filter, page)
        .then(data => {
          if (data.hits.length === 0) {
            toast.error(`Nothing found for your request 😔`);
            return;
          }
          setImages(prevState =>
            page === 1 ? data.hits : [...prevState, ...data.hits]
          );
          if (page === 1) {
            setTotalHits(data.totalHits);
          }
        })
        .then(() =>
          setTimeout(() => {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth',
            });
          }, 500)
        );
    } catch (err) {
      toast.error('Error!');
    } finally {
      setLoading(loading => !loading);
    }
  }, [filter, page]);

  useEffect(() => {
    if (page !== 1 && page >= totalPage) {
      toast(`👀 This is the Last page`);
    }
  }, [page, totalPage]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Form Submit
  const formSubmit = query => {
    if (query === filter) {
      return;
    }
    setFilter(query);
    setImages([]);
    setTotalHits(0);
    setPage(1);
  };

  // Selected Img
  const selectedImg = url => setSelected(url);

  // Click Load More Btn
  const clickLoadMoreBtn = () => {
    setPage(prevState => prevState + 1);
  };

  // Close Modal
  const closeModal = () => {
    setSelected(null);
  };

  return (
    <>
      <GlobalCSS />
      <Wrapper>
        <Toaster position="top-right" />
        <Searchbar propSubmit={formSubmit} />
        <ImageGallery images={images} selectedImg={selectedImg} />
        {loading && <LoaderSpin />}
        {selected && <Modal url={selected} onClose={closeModal} />}
        {totalHits !== images.length && <Button onClick={clickLoadMoreBtn} />}
      </Wrapper>
    </>
  );
};
