import React, { useState } from 'react'
import QrReader from 'react-qr-scanner'
import { FiCamera, FiX, FiRefreshCcw } from 'react-icons/fi'
import { useAuth } from '../../../Context/AuthContext'
import productionService from '../../../api/production.service'

const QRScannerPage = () => {
  const [scanning, setScanning] = useState(false)
  const [qrResult, setQrResult] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const { user } = useAuth()

  // ⭐ Added: Camera Mode State
  const [cameraMode, setCameraMode] = useState("environment")

  const handleScan = result => {
    if (result) {
      const scannedValue = result.text || result
      setQrResult(scannedValue)
      setScanning(false)

      try {
        const jsonData = JSON.parse(scannedValue)
        if (typeof jsonData === 'object') {
          setParsedData(jsonData)
        } else {
          setParsedData(null)
        }
      } catch {
        setParsedData(null)
      }
    }
  }

  const handleError = err => {
    console.error(err)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setApiResponse(null)
      const qrid = parsedData?.qrId || qrResult
      const payload = {
        qrImage: qrid
      }

      const response = await productionService.qrScan(user.accessToken, payload)
      console.log('after qr scan', response)
      setApiResponse(response.data)
    } catch (error) {
      console.error('API Error:', error)
      setApiResponse({ error: 'Failed to send data' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>QR Scanner</h2>
        <p className='text-sm text-gray-500 mb-6'>
          Scan any QR code easily with your camera
        </p>

        {qrResult ? (
          <div className='p-6 border rounded-2xl bg-gradient-to-br from-green-50 to-green-100 shadow-md animate-fade-in'>

            {apiResponse ? (
              <div className='mt-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border shadow-sm text-left animate-fade-in'>
                <h4 className='text-base font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                  {apiResponse.error ? '❌ Error' : '📦 QR Scan Result'}
                </h4>

                {apiResponse.error ? (
                  <p className='text-red-600 text-sm'>{apiResponse.error}</p>
                ) : (
                  <div className='space-y-3'>
                    <div>
                      <p className='text-xs text-gray-500 uppercase'>Message</p>
                      <p className='text-gray-800 font-medium'>
                        {apiResponse.message || '—'}
                      </p>
                    </div>

                    {apiResponse.data?.scannedQr && (
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='bg-white rounded-lg p-3 border'>
                          <p className='text-xs text-gray-500 uppercase'>
                            Production No
                          </p>
                          <p className='font-semibold text-gray-800'>
                            {apiResponse.data.scannedQr.productionNo}
                          </p>
                        </div>

                        <div className='bg-white rounded-lg p-3 border'>
                          <p className='text-xs text-gray-500 uppercase'>QR ID</p>
                          <p className='font-semibold text-gray-800'>
                            {apiResponse.data.scannedQr.qrId}
                          </p>
                        </div>

                        <div className='bg-white rounded-lg p-3 border'>
                          <p className='text-xs text-gray-500 uppercase'>
                            Dispatched Qty
                          </p>
                          <p className='font-semibold text-gray-800'>
                            {apiResponse.data.scannedQr.dispatchedQty}
                          </p>
                        </div>

                        <div className='bg-white rounded-lg p-3 border'>
                          <p className='text-xs text-gray-500 uppercase'>
                            Current Status
                          </p>
                          <p className='font-semibold text-green-700'>
                            {apiResponse.data.scannedQr.currentStatus}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className='mt-5'>
                  <button
                    onClick={() => {
                      setQrResult('')
                      setParsedData(null)
                      setApiResponse(null)
                    }}
                    className='flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition w-full sm:w-auto'
                  >
                    <FiRefreshCcw /> Scan Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2'>
                  ✅ Scanned QR Result
                </h3>

                {parsedData ? (
                  <div className='bg-white rounded-xl p-4 shadow-sm border text-left space-y-3'>
                    {Object.entries(parsedData).map(([key, value]) => (
                      <div
                        key={key}
                        className='flex justify-between items-center border-b pb-2 last:border-none'
                      >
                        <span className='text-sm font-medium text-gray-600 capitalize'>
                          {key}
                        </span>
                        <span className='text-sm font-semibold text-gray-800'>
                          {value.toString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='bg-white rounded-xl p-4 shadow-sm border text-left'>
                    <p className='text-xs text-gray-500 uppercase mb-1'>QR Value</p>
                    <p className='text-green-700 font-semibold break-words'>
                      {qrResult}
                    </p>
                  </div>
                )}

                <div className='mt-5 flex flex-col sm:flex-row gap-3 justify-center'>
                  <button
                    onClick={() => {
                      setQrResult('')
                      setParsedData(null)
                      setApiResponse(null)
                    }}
                    className='flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition w-full sm:w-auto'
                  >
                    <FiRefreshCcw /> Scan Again
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto transition ${
                      loading
                        ? 'bg-blue-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {!scanning ? (
              <button
                onClick={() => setScanning(true)}
                className='flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition shadow-md'
              >
                <FiCamera className='text-lg' /> Start Scanning
              </button>
            ) : (
              <div className='space-y-4 animate-fade-in'>
                <div className='rounded-xl overflow-hidden border shadow-md'>

                  {/* ⭐ Updated: Added camera constraints */}
                  <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                    constraints={{
                      video: { facingMode: cameraMode }
                    }}
                  />
                </div>

                {/* ⭐ Added Camera Switch Button */}
                <button
                  onClick={() =>
                    setCameraMode(prev =>
                      prev === 'environment' ? 'user' : 'environment'
                    )
                  }
                  className='w-full py-2 bg-indigo-600 text-white rounded-lg font-medium'
                >
                  Switch to {cameraMode === 'environment' ? 'Front' : 'Back'} Camera
                </button>

                <button
                  onClick={() => setScanning(false)}
                  className='flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition'
                >
                  <FiX /> Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default QRScannerPage
