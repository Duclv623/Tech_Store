'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const LatestProducts = () => {

    const displayQuantity = 4
    const products = useSelector(state => state.product.list) || []

    // Safe sort by createdAt (handle undefined createdAt)
    const sortedProducts = products.slice().sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt) : new Date(0)
        const bDate = b.createdAt ? new Date(b.createdAt) : new Date(0)
        return bDate - aDate
    }).slice(0, displayQuantity)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='Sản phẩm mới' description={`Hiển thị ${products.length < displayQuantity ? products.length : displayQuantity} / ${products.length} sản phẩm`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {sortedProducts.map((product, index) => (
                    <ProductCard key={product.id || index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default LatestProducts