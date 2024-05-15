import React, { useEffect } from 'react';

const SageMathCell = ({command}) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sagecell.sagemath.org/static/embedded_sagecell.js';
        script.async = true;
        script.onload = () => {
            window.sagecell.makeSagecell({ inputLocation: 'div.compute', evalButtonText: 'Compute Graph', editor:'codemirror-readonly', hide: ["fullScreen"]});
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            <div className="compute"><script type="text/x-sage">{command}</script></div>
        </div>
    );
};

export default SageMathCell;
