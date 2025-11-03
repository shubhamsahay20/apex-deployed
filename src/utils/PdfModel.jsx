import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/* -------------------- ✅ CUSTOMER REPORT -------------------- */
export const exportProductionPDF = customers => {
  const doc = new jsPDF()
  const headers = [['Name', 'Phone', 'Sales Person', 'Email', 'Location']]
  const rows = customers.map(row => [
    row.name || '',
    row.phone || '',
    row.salesPersonId?.name || '',
    row.email || '',
    row.location?.map(item => item.city).join(', ') || ''
  ])

  doc.setFontSize(14)
  doc.text('Customer Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  doc.save('customer_report.pdf')
}

export const printProductionPDF = customers => {
  const doc = new jsPDF()
  const headers = [['Name', 'Phone', 'Sales Person', 'Email', 'Location']]
  const rows = customers.map(row => [
    row.name || '',
    row.phone || '',
    row.salesPersonId?.name || '',
    row.email || '',
    row.location?.map(item => item.city).join(', ') || ''
  ])

  doc.setFontSize(14)
  doc.text('Customer Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  window.open(doc.output('bloburl'), '_blank').print()
}

/* -------------------- ✅ ARTICLE REPORT -------------------- */
export const exportArticlesPDF = articles => {
  const doc = new jsPDF()
  const headers = [
    [
      'Article',
      'Category Code',
      'Size',
      'Color',
      'Type',
      'Quality',
      'Production Qty',
      'Warehouse Qty',
      'Total Available'
    ]
  ]
  const rows = articles.map(row => [
    row.article || '',
    row.categoryCode || '',
    row.size || '',
    row.color || '',
    row.type || '',
    row.quality || '',
    row.Production_Qty || '',
    row.Warehouse_Qty || '',
    row.Total_Available || ''
  ])

  doc.setFontSize(14)
  doc.text('Articles Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  doc.save('articles_report.pdf')
}

export const printArticlesPDF = articles => {
  const doc = new jsPDF()
  const headers = [
    [
      'Article',
      'Category Code',
      'Size',
      'Color',
      'Type',
      'Quality',
      'Production Qty',
      'Warehouse Qty',
      'Total Available'
    ]
  ]
  const rows = articles.map(row => [
    row.article || '',
    row.categoryCode || '',
    row.size || '',
    row.color || '',
    row.type || '',
    row.quality || '',
    row.Production_Qty || '',
    row.Warehouse_Qty || '',
    row.Total_Available || ''
  ])

  doc.setFontSize(14)
  doc.text('Articles Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  window.open(doc.output('bloburl'), '_blank').print()
}

/* -------------------- ✅ SALES REPORT -------------------- */
export const exportSalesPDF = tableData => {
  const doc = new jsPDF()
  const headers = [
    [
      'Date',
      'Article',
      'Customer',
      'Size',
      'Color',
      'Sell',
      'Quantity',
      'Status'
    ]
  ]
  const rows = tableData.map(row => [
    row.date || '',
    row.article || '',
    row.customer || '',
    row.size || '',
    row.color || '',
    row.sell || '',
    row.quantity || '',
    row.status || ''
  ])

  doc.setFontSize(14)
  doc.text('Sales Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  doc.save('sales_report.pdf')
}

export const printSalesPDF = tableData => {
  const doc = new jsPDF()
  const headers = [
    [
      'Date',
      'Article',
      'Customer',
      'Size',
      'Color',
      'Sell',
      'Quantity',
      'Status'
    ]
  ]
  const rows = tableData.map(row => [
    row.date || '',
    row.article || '',
    row.customer || '',
    row.size || '',
    row.color || '',
    row.sell || '',
    row.quantity || '',
    row.status || ''
  ])

  doc.setFontSize(14)
  doc.text('Sales Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  window.open(doc.output('bloburl'), '_blank').print()
}

/* -------------------- ✅ QR CODE LABELS -------------------- */
export const exportQRCodePDF = async (
  qrData,
  selectedProduction,
  productData
) => {
  try {
    const doc = new jsPDF()

    const qrCodes = Array.isArray(qrData)
      ? qrData
          .filter(prod => prod._id === selectedProduction)
          .flatMap(prod => prod.qrCodes || [])
      : qrData?.qrCodes || []

    if (qrCodes.length === 0) {
      throw new Error('No QR codes available')
    }

    doc.setFontSize(16)
    doc.text('QR Code Labels', 14, 20)

    const selectedProd = productData.find(p => p._id === selectedProduction)
    if (selectedProd) {
      doc.setFontSize(12)
      doc.text(`Production: ${selectedProd.productionNo}`, 14, 35)
      doc.text(`Factory: ${selectedProd.factory?.name || 'N/A'}`, 14, 45)
    }

    const headers = [['Article', 'Size', 'Color', 'Type', 'Date']]
    const rows = qrCodes.map(qr => [
      qr.article || 'N/A',
      qr.size || 'N/A',
      qr.color || 'N/A',
      qr.type || 'N/A',
      new Date().toLocaleDateString()
    ])

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 55
    })

    doc.save('qr_codes.pdf')
  } catch (error) {
    console.error('PDF generation error:', error)
    return null
  }
}

export const printQRCodePDF = async (
  qrData,
  selectedProduction,
  productData
) => {
  try {
    const doc = new jsPDF()

    const qrCodes = Array.isArray(qrData)
      ? qrData
          .filter(prod => prod._id === selectedProduction)
          .flatMap(prod => prod.qrCodes || [])
      : qrData?.qrCodes || []

    if (qrCodes.length === 0) {
      throw new Error('No QR codes available')
    }

    doc.setFontSize(16)
    doc.text('QR Code Labels', 14, 20)

    const selectedProd = productData.find(p => p._id === selectedProduction)
    if (selectedProd) {
      doc.setFontSize(12)
      doc.text(`Production: ${selectedProd.productionNo}`, 14, 35)
      doc.text(`Factory: ${selectedProd.factory?.name || 'N/A'}`, 14, 45)
    }

    const headers = [['Article', 'Size', 'Color', 'Type', 'Date']]
    const rows = qrCodes.map(qr => [
      qr.article || 'N/A',
      qr.size || 'N/A',
      qr.color || 'N/A',
      qr.type || 'N/A',
      new Date().toLocaleDateString()
    ])

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 55
    })

    window.open(doc.output('bloburl'), '_blank').print()
  } catch (error) {
    console.error('PDF generation error:', error)
    return null
  }
}

/* -------------------- ✅ SCHEMES REPORT (NEW) -------------------- */
export const exportSchemesPDF = schemes => {
  if (!schemes || schemes.length === 0) {
    return alert('No data to export')
  }

  const doc = new jsPDF()

  const headers = [
    [
      'Starting Date',
      'Ending Date',
      'Scheme Name',
      'Scheme Description',
      'Scheme Type',
      'To Apply'
    ]
  ]

  const rows = schemes.map(scheme => [
    scheme.date || '',
    scheme.expireDate || '',
    scheme.schemesName || '',
    scheme.schemesDescription || '',
    scheme.schemesType || '',
    scheme.schemesQuantity || ''
  ])

  doc.setFontSize(14)
  doc.text('Schemes Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  doc.save('schemes_report.pdf')
}

export const printSchemesPDF = schemes => {
  if (!schemes || schemes.length === 0) {
    return alert('No data to print')
  }

  const doc = new jsPDF()

  const headers = [
    [
      'Starting Date',
      'Ending Date',
      'Scheme Name',
      'Scheme Description',
      'Scheme Type',
      'To Apply'
    ]
  ]

  const rows = schemes.map(scheme => [
    scheme.date || '',
    scheme.expireDate || '',
    scheme.schemesName || '',
    scheme.schemesDescription || '',
    scheme.schemesType || '',
    scheme.schemesQuantity || ''
  ])

  doc.setFontSize(14)
  doc.text('Schemes Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  window.open(doc.output('bloburl'), '_blank').print()
}
export const exportProductionDataPDF = productions => {
  if (!productions || productions.length === 0)
    return alert('No data to export')

  const doc = new jsPDF()
  const headers = [['Date', 'Production No', 'Article', 'Quantity', 'Factory']]
  const rows = productions.map(item => [
    new Date(item.productionDate).toLocaleDateString('en-GB'),
    item.productionNo || '',
    item.article || '',
    item.productionQuantity || '',
    item.factory?.name || ''
  ])

  doc.setFontSize(14)
  doc.text('Production Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  doc.save('production_report.pdf')
}

export const printProductionDataPDF = productions => {
  if (!productions || productions.length === 0) return alert('No data to print')

  const doc = new jsPDF()
  const headers = [['Date', 'Production No', 'Article', 'Quantity', 'Factory']]
  const rows = productions.map(item => [
    new Date(item.productionDate).toLocaleDateString('en-GB'),
    item.productionNo || '',
    item.article || '',
    item.productionQuantity || '',
    item.factory?.name || ''
  ])

  doc.setFontSize(14)
  doc.text('Production Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  window.open(doc.output('bloburl'), '_blank').print()
}
export const exportArticlesDataPDF = articles => {
  if (!articles || articles.length === 0) return alert('No data to export')

  const doc = new jsPDF()
  const headers = [
    [
      'Article',
      'Category Code',
      'Size',
      'Color',
      'Soft/Hard',
      'Quality',
      'Production Qty',
      'Warehouse Qty',
      'Total Quantity'
    ]
  ]

  const rows = articles.map(row => [
    row.article || '',
    row.categoryCode || '',
    row.size || '',
    row.color || '',
    row.type || '',
    row.quality || '',
    row.Production_Qty || '',
    row.Warehouse_Qty || '',
    row.Total_Available || ''
  ])

  doc.setFontSize(14)
  doc.text('Articles Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  doc.save('articles_report.pdf')
}
// Add this to your PdfModel.js
export const exportSalesOrdersPDF = orders => {
  if (!orders || orders.length === 0) return alert('No data to export')

  const doc = new jsPDF()
  const headers = [
    [
      'Date',
      'Sale Order',
      'Customer',
      'Account Status',
      'Inventory Status',
      'Warehouse Status',
      'Delivery Status'
    ]
  ]

  const rows = orders.map(row => [
    new Date(row.updatedAt).toLocaleString('en-GB'),
    row.salesOrderNo || '',
    row.customer?.name || '',
    row.accountSectionApproval || '',
    row.inventoryManagerApproval || '',
    row.ScannedByWarehouseManager || '',
    row.deliveryStatus || ''
  ])

  doc.setFontSize(14)
  doc.text('Sales Orders Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  doc.save('sales_orders_report.pdf')
}

export const printSalesOrdersPDF = orders => {
  if (!orders || orders.length === 0) return alert('No data to print')

  const doc = new jsPDF()
  const headers = [
    [
      'Date',
      'Sale Order',
      'Customer',
      'Account Status',
      'Inventory Status',
      'Warehouse Status',
      'Delivery Status'
    ]
  ]

  const rows = orders.map(row => [
    new Date(row.updatedAt).toLocaleString('en-GB'),
    row.salesOrderNo || '',
    row.customer?.name || '',
    row.accountSectionApproval || '',
    row.inventoryManagerApproval || '',
    row.ScannedByWarehouseManager || '',
    row.deliveryStatus || ''
  ])

  doc.setFontSize(14)
  doc.text('Sales Orders Report', 14, 10)

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  window.open(doc.output('bloburl'), '_blank').print()
}

export const exportAccountDetailPDF = orders => {
  if (!orders || orders.length === 0) return

  const doc = new jsPDF()

  // Table headers
  const headers = [
    [
      'Date',
      'Sale Order No.',
      'Sales Person',
      'Sales Phone',
      'Customer Name',
      'Total Quantity',
      'Status'
    ]
  ]

  // Map data to rows
  const rows = orders.map(o => [
    new Date(o.createdAt).toLocaleDateString('en-GB'),
    o.salesOrderNo,
    o.createdBy?.name || '',
    o.createdBy?.phone || '',
    o.customer?.name || '',
    o.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
    o.accountSectionApproval || 'PENDING'
  ])

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  doc.save('SalesOrders.pdf')
}
export const exportWarehousePDF = articles => {
  if (!articles || articles.length === 0) return

  const doc = new jsPDF()

  const headers = [
    [
      'Article',
      'Category Code',
      'Size',
      'Color',
      'Type',
      'Quality',
      'Production Qty',
      'Warehouse Qty',
      'Total Qty'
    ]
  ]

  const rows = articles.map(row => [
    row.article || '',
    row.categoryCode || '',
    row.size || '',
    row.color || '',
    row.type || '',
    row.quality || '',
    row.Production_Qty || 0,
    row.Warehouse_Qty || 0,
    row.Total_Available || 0
  ])

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  })

  doc.save('Articles_Report.pdf')
}
export const exportStockVerifyPDF = (data) => {
  if (!data || data.length === 0) return;

  const doc = new jsPDF();

  const headers = [
    ['Article', 'Sale Order', 'Warehouse', 'Customer', 'Quantity', 'Status']
  ];

  const rows = data.map((row) => [
    row.article || '',
    row.salesOrderNo || '',
    row.warehouse?.name || '',
    row.customer?.name || '',
    row.quantity || 0,
    row.ScanByorder || 'UNSCANNED'
  ]);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20
  });

  doc.save('Stock_Verify_Report.pdf');
};
export const printStockVerifyPDF = (data) => {
  const doc = new jsPDF();
  const headers = [
    ["Article No", "Sale Order", "Warehouse", "Customer", "Quantity", "Status"],
  ];

  const rows = data.map((row) => [
    row.article || "",
    row.salesOrderNo || "",
    row.warehouse?.name || "",
    row.customer?.name || "",
    row.quantity || "",
    row.ScanByorder || "N/A",
  ]);

  doc.text("Stock Verification Report", 14, 15);
  autoTable(doc, {
    startY: 25,
    head: headers,
    body: rows,
    styles: { fontSize: 10 },
  });

  // ✅ Generate Blob and open in a new tab AFTER rendering
  const blob = doc.output("blob");
  const blobURL = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
  window.open(blobURL);
};
export const exportCustomersPDF = (customers) => {
  if (!customers || customers.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF();
  doc.text("Customers Report", 14, 15);

  const headers = [["Name", "Phone", "Email", "Address"]];

  const rows = customers.map((c) => [
    c.name || "",
    c.phone || "",
    c.email || "",
    c.location
      ? c.location.map((l) => `${l.address}, ${l.city?.toUpperCase()}`).join("; ")
      : "",
  ]);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 25,
  });

  doc.save("Customers_Report.pdf");
};
export const printCustomersPDF = (customers) => {
  if (!customers || customers.length === 0) {
    alert("No data to print");
    return;
  }

  const doc = new jsPDF();
  doc.text("Customers Report", 14, 15);

  const headers = [["Name", "Phone", "Email", "Address"]];
  const rows = customers.map((c) => [
    c.name || "",
    c.phone || "",
    c.email || "",
    c.location
      ? c.location.map((l) => `${l.address}, ${l.city?.toUpperCase()}`).join("; ")
      : "",
  ]);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 25,
  });

  window.open(doc.output("bloburl"), "_blank");
};
export const exportViewSalesPDF = (data) => {
  const doc = new jsPDF();
  const headers = [['Name', 'Phone', 'Email', 'Role', 'Location']];

  const rows = data.map(item => [
    item.name || '',
    item.phone || '',
    item.email || '',
    item.role || '',
    item.location || '',
  ]);

  doc.text('Role Details Report', 14, 15);
  autoTable(doc, { startY: 25, head: headers, body: rows });
  doc.save('RoleDetails.pdf');
};

export const printViewSalesPDF = (data) => {
  const doc = new jsPDF();
  const headers = [['Name', 'Phone', 'Email', 'Role', 'Location']];

  const rows = data.map(item => [
    item.name || '',
    item.phone || '',
    item.email || '',
    item.role || '',
    item.location || '',
  ]);

  doc.text('Role Details Report', 14, 15);
  autoTable(doc, { startY: 25, head: headers, body: rows });
  
  // Opens print dialog instead of saving
  const blob = doc.output('bloburl');
  window.open(blob);
};