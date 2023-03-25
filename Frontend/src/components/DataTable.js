import * as React from 'react';

export default function DataTable({ labels, data }) {

    return (
        <>
            <table >
                <tr>
                    {
                        labels.map((label) => <th>{label}</th>)
                    }
                </tr>

                {
                    data.map((item) => <>
                        <tr style={{ textAlign: 'center' }}>
                            {
                                item.map((element, id) =>
                                    <td>
                                        <span style={id === 0 | id === 4 ? { color: "red" } : {}}>
                                            {element}
                                        </span>
                                    </td>
                                )
                            }
                        </tr>
                    </>)
                }

            </table>


        </>
    );
}