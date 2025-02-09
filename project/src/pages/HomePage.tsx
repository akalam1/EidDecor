import React from 'react';
import Banner from '../components/Banner';
import Categories from '../components/Categories';
import CountdownTimer from '../components/CountdownTimer';
import FeaturedProducts from '../components/FeaturedProducts';

const HomePage = () => {
  return (
    <>
      <Banner />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <FeaturedProducts />
        <CountdownTimer />
        <Categories />
      </div>
    </>
  );
};

export default HomePage;