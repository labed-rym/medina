declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: {
        type?: string;
        quality?: number;
      };
      html2canvas?: {
        scale?: number;
        useCORS?: boolean;
        allowTaint?: boolean;
        scrollY?: number;
        scrollX?: number;
        height?: number;
        backgroundColor?: string;
        logging?:boolean;
        windowHeight?:number;
        letterRendering?: boolean;
            allowTaint?: boolean;
        
      };
      jsPDF?: {
        unit?: string;
        format?: string;
        orientation?: 'portrait' | 'landscape';
        putOnlyUsedFonts?: boolean;
        compress?: boolean;
      };
      pagebreak?: {
        mode?: string[];
        before?: string;
        after?: string;
        avoid?: string;
      };
    }
  
    interface Html2PdfInstance {
      from(element: HTMLElement | string): Html2PdfInstance;
      set(options: Html2PdfOptions): Html2PdfInstance;
      save(): Promise<any>;
      toPdf(): Html2PdfInstance;
      get(type: string, options?: any): Promise<any>;
      outputPdf(type?: string, options?: any): any;
      output(type?: string, options?: any): any;
    }
  
    function html2pdf(): Html2PdfInstance;
    function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2PdfInstance;
  
    export default html2pdf;
  }