import * as React from 'react';


//component to render a dynamic tabel
//labels is list of strings for column titles
//data is a list of lists 
export default function DataTable({ labels, data }) {

    return (
        <>
            <table style={{ width: '500px' }}>
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


        </>
    );
}