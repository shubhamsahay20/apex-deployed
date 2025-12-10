import React, { useState } from 'react'
import QrReader from 'react-qr-scanner'
import { FiCamera, FiX, FiRefreshCcw } from 'react-icons/fi'
import { useAuth } from '../../../Context/AuthContext'
import productionService from '../../../api/production.service'
import { toast } from 'react-toastify'

const QRScannerPage = () => {
  const [scanning, setScanning] = useState(false)
  const [qrResult, setQrResult] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const { user } = useAuth()

  const [cameraMode, setCameraMode] = useState('environment')

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
      toast.success( response.data.data.message || 'Data submitted successfully')
      setApiResponse(response.data)
    } catch (error) {
      console.error('API Error:', error)
      toast.error( error.response.data.error ||  'Failed to send data')
      setApiResponse({ error: 'Failed to send data' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">
          QR Scanner
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          Scan any QR code easily with your camera
        </p>

        {qrResult ? (
          <div className="p-4 sm:p-6 border rounded-xl bg-gradient-to-br from-green-50 to-green-100 shadow-md">

            {apiResponse ? (
              <div className="mt-2 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border shadow-sm text-left">
                <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  {apiResponse.error ? '❌ Error' : '📦 QR Scan Result'}
                </h4>

                {apiResponse.error ? (
                  <p className="text-red-600 text-xs sm:text-sm">{apiResponse.error}</p>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Message</p>
                      <p className="text-gray-800 font-medium">
                        {apiResponse.message || '—'}
                      </p>
                    </div>

                    {apiResponse.data?.scannedQr && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border">
                          <p className="text-[11px] text-gray-500 uppercase">Production No</p>
                          <p className="font-semibold text-gray-800 text-sm">
                            {apiResponse.data.scannedQr.productionNo}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border">
                          <p className="text-[11px] text-gray-500 uppercase">QR ID</p>
                          <p className="font-semibold text-gray-800 text-sm">
                            {apiResponse.data.scannedQr.qrId}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border">
                          <p className="text-[11px] text-gray-500 uppercase">Dispatched Qty</p>
                          <p className="font-semibold text-gray-800 text-sm">
                            {apiResponse.data.scannedQr.dispatchedQty}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border">
                          <p className="text-[11px] text-gray-500 uppercase">Current Status</p>
                          <p className="font-semibold text-green-700 text-sm">
                            {apiResponse.data.scannedQr.currentStatus}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5">
                  <button
                    onClick={() => {
                      setQrResult('')
                      setParsedData(null)
                      setApiResponse(null)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm w-full"
                  >
                    <FiRefreshCcw /> Scan Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                  ✅ Scanned QR Result
                </h3>

                {parsedData ? (
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border text-left space-y-2 text-sm">
                    {Object.entries(parsedData).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b pb-1 last:border-none"
                      >
                        <span className="text-gray-600 capitalize text-xs sm:text-sm">
                          {key}
                        </span>
                        <span className="font-semibold text-gray-800 break-all text-xs sm:text-sm">
                          {value.toString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border text-left">
                    <p className="text-[11px] text-gray-500 uppercase mb-1">QR Value</p>
                    <p className="text-green-700 font-semibold break-all text-sm">{qrResult}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setQrResult('')
                      setParsedData(null)
                      setApiResponse(null)
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                  >
                    <FiRefreshCcw /> Scan Again
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-2 rounded-lg text-sm text-white ${
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
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
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-md"
              >
                <FiCamera className="text-lg" /> Start Scanning
              </button>
            ) : (
              <div className="space-y-3 sm:space-y-4">

                <div className="rounded-xl overflow-hidden border shadow-md w-full">
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

                <button
                  onClick={() =>
                    setCameraMode(prev =>
                      prev === 'environment' ? 'user' : 'environment'
                    )
                  }
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm"
                >
                  Switch to {cameraMode === 'environment' ? 'Front' : 'Back'} Camera
                </button>

                <button
                  onClick={() => setScanning(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
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
