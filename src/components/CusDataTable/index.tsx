import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import './index.css';
import prod1 from '../../assets/images/products/product-1.jpg'
import prod2 from '../../assets/images/products/product-2.jpg'
import prod3 from '../../assets/images/products/product-3.jpg'
import prod4 from '../../assets/images/products/product-4.jpg'

const columns: GridColDef[] = [
  { field: 'avatar', headerName: '', width: 40,
    renderCell: (params) => (
      <img src={params.row.avatar} alt='' />
    ),
  },
  { field: 'product', headerName: 'Product', width: 200 },
  { field: 'tags', headerName: 'Tags', width: 200 },
  { field: 'asin', headerName: 'ASIN', width: 120 },
  { field: 'price', headerName: 'Price', type: 'number', width: 50 },
  { field: 'target', headerName: 'Target AcoS', type: 'number', width: 50 },
  { field: 'bsr', headerName: 'BSR', width: 120 },
  { field: 'rating', headerName: 'Rating', type: 'number', width: 60 },
  { field: 'date', headerName: 'Publication Date', width: 120 },
  { field: 'royalties', headerName: 'All Time Royalties', type: 'number', width: 120 },
  { field: 'sold', headerName: 'All Time Unit Sold', type: 'number', width: 120 }
];

const rows = [
  { id: 1, avatar: prod1, product: 'The Power', productSubText: 'Monica', tags: 'Fiction, Drama, Romance', asin: '123DFF450df', price: '$2', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 2, avatar: prod2, product: 'The Pivotin2', productSubText: 'Ortega', tags: 'Fiction, Drama, Comedy', asin: '123DFF45340', price: '$4', target: '4%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 3, avatar: prod3, product: 'Power of Pivotin3', productSubText: 'Monica Ortega', tags: 'Drama, Romance, Comedy', asin: '123DFewetF450', price: '$32', target: '6%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 4, avatar: prod4, product: 'Pivotin4', productSubText: 'Montega', tags: 'Fiction, Romance, Comedy', asin: '123DFF5345450', price: '$24', target: '3%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 5, avatar: prod1, product: 'Power', productSubText: 'Monga', tags: 'Fiction, Drama, ', asin: '123DFFaga450', price: '$32', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 6, avatar: prod1, product: 'The Power', productSubText: 'Monica', tags: 'Fiction, Drama, Romance', asin: '123DFF450df', price: '$2', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 7, avatar: prod2, product: 'The Pivotin2', productSubText: 'Ortega', tags: 'Fiction, Drama, Comedy', asin: '123DFF45340', price: '$4', target: '4%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 8, avatar: prod3, product: 'Power of Pivotin3', productSubText: 'Monica Ortega', tags: 'Drama, Romance, Comedy', asin: '123DFewetF450', price: '$32', target: '6%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 9, avatar: prod4, product: 'Pivotin4', productSubText: 'Montega', tags: 'Fiction, Romance, Comedy', asin: '123DFF5345450', price: '$24', target: '3%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 10, avatar: prod1, product: 'Power', productSubText: 'Monga', tags: 'Fiction, Drama, ', asin: '123DFFaga450', price: '$32', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 11, avatar: prod1, product: 'The Power', productSubText: 'Monica', tags: 'Fiction, Drama, Romance', asin: '123DFF450df', price: '$2', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 12, avatar: prod2, product: 'The Pivotin2', productSubText: 'Ortega', tags: 'Fiction, Drama, Comedy', asin: '123DFF45340', price: '$4', target: '4%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 13, avatar: prod3, product: 'Power of Pivotin3', productSubText: 'Monica Ortega', tags: 'Drama, Romance, Comedy', asin: '123DFewetF450', price: '$32', target: '6%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 14, avatar: prod4, product: 'Pivotin4', productSubText: 'Montega', tags: 'Fiction, Romance, Comedy', asin: '123DFF5345450', price: '$24', target: '3%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 15, avatar: prod1, product: 'Power', productSubText: 'Monga', tags: 'Fiction, Drama, ', asin: '123DFFaga450', price: '$32', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 16, avatar: prod1, product: 'The Power', productSubText: 'Monica', tags: 'Fiction, Drama, Romance', asin: '123DFF450df', price: '$2', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 17, avatar: prod2, product: 'The Pivotin2', productSubText: 'Ortega', tags: 'Fiction, Drama, Comedy', asin: '123DFF45340', price: '$4', target: '4%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 18, avatar: prod3, product: 'Power of Pivotin3', productSubText: 'Monica Ortega', tags: 'Drama, Romance, Comedy', asin: '123DFewetF450', price: '$32', target: '6%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 19, avatar: prod4, product: 'Pivotin4', productSubText: 'Montega', tags: 'Fiction, Romance, Comedy', asin: '123DFF5345450', price: '$24', target: '3%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 20, avatar: prod1, product: 'Power', productSubText: 'Monga', tags: 'Fiction, Drama, ', asin: '123DFFaga450', price: '$32', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 21, avatar: prod1, product: 'The Power', productSubText: 'Monica', tags: 'Fiction, Drama, Romance', asin: '123DFF450df', price: '$2', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 22, avatar: prod2, product: 'The Pivotin2', productSubText: 'Ortega', tags: 'Fiction, Drama, Comedy', asin: '123DFF45340', price: '$4', target: '4%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 23, avatar: prod3, product: 'Power of Pivotin3', productSubText: 'Monica Ortega', tags: 'Drama, Romance, Comedy', asin: '123DFewetF450', price: '$32', target: '6%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 24, avatar: prod4, product: 'Pivotin4', productSubText: 'Montega', tags: 'Fiction, Romance, Comedy', asin: '123DFF5345450', price: '$24', target: '3%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
  { id: 25, avatar: prod1, product: 'Power', productSubText: 'Monga', tags: 'Fiction, Drama, ', asin: '123DFFaga450', price: '$32', target: '2%', bsr: 'US #3,456 | UK #2,445', rating: 1346, date: 12/2/2023, royalties: '$1346', sold: 23849 },
];

export default function CusDataTable() {
  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
