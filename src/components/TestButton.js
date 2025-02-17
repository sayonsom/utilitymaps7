import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState } from 'react'
import { Loader2, WifiOff } from "lucide-react"

export default function TestButton({ 
  zoneId, 
  isLoading = false, 
  hasError = false, 
  errorMessage = '',
  errorType = '',
  onTestStart,
  onTestComplete 
}) {
  const [open, setOpen] = useState(false)
  const isNetworkError = errorType === 'network'

  const handleRunTest = () => {
    if (isNetworkError) {
      return // Don't allow test to run if there's a network error
    }
    if (onTestStart) {
      onTestStart(zoneId)
    }
    console.log(`Running test for zone ${zoneId}`)
    setOpen(false)
    if (onTestComplete) {
      onTestComplete(zoneId, hasError ? { error: errorMessage } : { success: true })
    }
  }

  return (
    <>
      <Button
        variant={hasError ? "destructive" : "outline"}
        size="sm"
        onClick={() => setOpen(true)}
        disabled={isLoading || isNetworkError}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : isNetworkError ? (
          <>
            <WifiOff className="mr-2 h-4 w-4" />
            Offline
          </>
        ) : hasError ? (
          'Test Failed'
        ) : (
          'Test Now'
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNetworkError ? 'Network Error' : hasError ? 'Test Failed' : 'Run Zone Test'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {hasError ? (
              <div className={`p-4 rounded-md ${isNetworkError ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-500'}`}>
                {isNetworkError ? (
                  <div className="flex items-center gap-2">
                    <WifiOff className="h-5 w-5" />
                    <span>Network Error. Test cannot run. Please check your connection and try again.</span>
                  </div>
                ) : (
                  errorMessage || 'An unknown error occurred'
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">GET REQUEST:</span>
                  <span className="col-span-3">N/A</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">API TO CALL:</span>
                  <span className="col-span-3">N/A</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Data Frequency:</span>
                  <span className="col-span-3">N/A</span>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {!isNetworkError && (
              <Button 
                onClick={handleRunTest}
                disabled={isLoading}
                variant={hasError ? "destructive" : "default"}
              >
                {hasError ? 'Retry Test' : 'Run Test'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 