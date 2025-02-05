import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import OrderPlaced from './pages/ordersplaced';
import ListProduct from './pages/product/ListProduct';
import AddProduct from "./pages/product/Addproduct";
import AddCity from './pages/city/Addcity';
import ListCity from './pages/city/Listcity';
import AddCategory from "./pages/category/Addcategory";
import ListCategory from './pages/category/Listcategory';
import PaymentList from './pages/PaymentList';
import AddSubCategory from './pages/subCategory/Add';
import ListSubCategory from './pages/subCategory/List';
import AddBenefit from './pages/benefit/Addbenefit';
import ListBenefit from './pages/benefit/Listbenefits';
import AddOffer from './pages/offer/Addoffer';
import ListOffer from './pages/offer/Listoffer';
import KYCList from './pages/kycList';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/ordersplaced" element={<OrderPlaced />} />
            <Route path="/products/list" element={<ListProduct />} />
            <Route path="/product/add" element={<AddProduct />} />
            <Route path="categories/list" element={<ListCategory />} />
            <Route path="/categories/add" element={<AddCategory />} />
            <Route path="/city/list" element={<ListCity />} />
            <Route path="/city/add" element={<AddCity/>} />
            <Route path="paymentlist" element={<PaymentList />} />
            <Route path="/sub-Categories/list" element={<ListSubCategory />} />
            <Route path="/sub-Categories/add" element={<AddSubCategory />} />
            <Route path="/benefits/list" element={<ListBenefit />} />
            <Route path="/benefit/add" element={<AddBenefit />} />
            <Route path="/offers/list" element={<ListOffer />} />
            <Route path="/offer/add" element={<AddOffer />} />
            <Route path="/kyclist" element={<KYCList />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
