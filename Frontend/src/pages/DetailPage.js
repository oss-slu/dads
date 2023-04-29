import './DetailPage.css'
import React from 'react'
import InfoTable from '../components/FunctionDetail/InfoTable'

const DetailPage = ({ width }) => {
  return (
    <div style={{marginLeft: width}}>
        <div className="info-container">
            <InfoTable />
        </div>
    </div>
  )
}

export default DetailPage