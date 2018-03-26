import React, { Component } from 'react';
import PdfPage from './PdfPage';
import FaSpinner from 'react-icons/lib/fa/spinner';

class Pdf extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.onDocumentComplete = this.onDocumentComplete.bind(this);
        this.getDocument = this.getDocument.bind(this);
    }

    toString(){
        return "PdfFile";
    }

    componentDidMount() {
        this.loadPDFDocument(this.props);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.scale !== this.props.scale || nextProps.file !== this.props.file)
        this.loadPDFDocument(nextProps);
    }

    componentWillUnmount() {
        const { pdf } = this.state;
        if (pdf) {
            pdf.destroy();
        }
    }

    onDocumentComplete(pdf) {
        this.setState({ pdf });
        const { onDocumentComplete } = this.props;
        if (typeof onDocumentComplete === 'function') {
            onDocumentComplete(pdf.numPages);
        }
    }

    onDocumentError(error) {
        console.error(`${this.toString()} -- ERROR in loading file`, error);
    }

    getDocument(val) {
        const docPromise = window.PDFJS.getDocument(val).promise
            .then(this.onDocumentComplete)
            .catch(this.onDocumentError);
        return docPromise;
    }

    loadPDFDocument(props) {
        if (props.file && typeof props.file === 'string') {
            this.pdfCheck = setInterval(()=> {
                if (window.PDFJS) {
                    this.getDocument(props.file);
                    clearInterval(this.pdfCheck);
                }
            }, 200)

        } else {
            throw new Error('File param is required');
        }
    }

    render() {
        const {pdf} = this.state,
            {rotation} = this.props;
        if (pdf) {
            return (
                <div className="pdf-list">
                    {[...Array(pdf.numPages)].map((_, page) =>
                        <PdfPage
                            key={pdf.pdfInfo.fingerprint+page}
                            pdf={pdf}
                            page={page + 1}
                            rotation={rotation}
                            scale={this.props.scale}
                            className={this.props.className}
                        />,
                    )}
                </div>
            );
        } else {
            return <FaSpinner/>;
        }
    }
}

export default Pdf;
