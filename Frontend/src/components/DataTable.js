import * as React from 'react';
import $ from 'jquery';
import Pagination from 'react-bootstrap/Pagination';

//component to render a dynamic tabel
//labels is list of strings for column titles
//data is a list of lists 
export default function DataTable({ labels, data }) {

    return (
        <>
            <table id="resultstable" className="table table-sm table-bordered table-striped" style={{ width: '700px' }}>
                <thead>
                    <tr>
                        {
                            labels.map((label) => <th>{label}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, key) => <>
                            <tr style={{ textAlign: 'center' }}>
                                {
                                    item.map((element, id) =>
                                        <td>
                                            <span>
                                                {element}
                                            </span>
                                        </td>
                                    )
                                }
                            </tr>
                        </>)
                    }
                </tbody>
            </table>
	<Pagination size="lg">
      		<Pagination.First />
      		<Pagination.Prev />
      		<Pagination.Item>{1}</Pagination.Item>

      		<Pagination.Item active>{12}</Pagination.Item>

      		<Pagination.Item>{20}</Pagination.Item>
      		<Pagination.Next />
      		<Pagination.Last />
    	</Pagination>
        </>
    );
}

