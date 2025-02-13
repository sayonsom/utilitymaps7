import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const Filter = ({ onFilterChange, colorMode }) => {
  // Update state to handle multiple selections
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedRisks, setSelectedRisks] = useState([]);
  const [selectedImpacts, setSelectedImpacts] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);

  // Update handlers for checkbox changes
  const handleStatusChange = (checked, value) => {
    setSelectedStatuses(prev => 
      checked ? [...prev, value] : prev.filter(status => status !== value)
    );
    // Update filter logic here
  };

  const handleRiskChange = (checked, value) => {
    setSelectedRisks(prev =>
      checked ? [...prev, value] : prev.filter(risk => risk !== value)
    );
    // Update filter logic here
  };

  const handleImpactChange = (checked, value) => {
    setSelectedImpacts(prev =>
      checked ? [...prev, value] : prev.filter(impact => impact !== value)
    );
    // Update filter logic here
  };

  const handleOwnerChange = (checked, value) => {
    setSelectedOwners(prev =>
      checked ? [...prev, value] : prev.filter(owner => owner !== value)
    );
    // Update filter logic here
  };

  return (
    <div className="filter-container absolute top-4 right-4 z-10 bg-white p-2 rounded-lg shadow-md w-64">
      <Accordion type="single" collapsible defaultValue="">
        <AccordionItem value="item-1">
          <AccordionTrigger>Filters</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 font-medium">Zone Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rt-6h" onCheckedChange={(checked) => handleStatusChange(checked, 'Real-Time(<6hours)')} />
                    <Label htmlFor="rt-6h">Real-Time(&lt;6hours): 206</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="est-daily" onCheckedChange={(checked) => handleStatusChange(checked, 'EstimatedDaily')} />
                    <Label htmlFor="est-daily">EstimatedDaily: 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="est-monthly" onCheckedChange={(checked) => handleStatusChange(checked, 'EstimatedMonthly')} />
                    <Label htmlFor="est-monthly">EstimatedMonthly: 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="not-available" onCheckedChange={(checked) => handleStatusChange(checked, 'Not Available')} />
                    <Label htmlFor="not-available">Not Available: 1159</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="est-annually" onCheckedChange={(checked) => handleStatusChange(checked, 'EstimatedAnnually')} />
                    <Label htmlFor="est-annually">EstimatedAnnually</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="est-historically" onCheckedChange={(checked) => handleStatusChange(checked, 'EstimatedHistorically')} />
                    <Label htmlFor="est-historically">EstimatedHistorically</Label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-medium">Filter by Risk</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="risk-low" onCheckedChange={(checked) => handleRiskChange(checked, 'Low')} />
                    <Label htmlFor="risk-low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="risk-medium" onCheckedChange={(checked) => handleRiskChange(checked, 'Medium')} />
                    <Label htmlFor="risk-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="risk-high" onCheckedChange={(checked) => handleRiskChange(checked, 'High')} />
                    <Label htmlFor="risk-high">High</Label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-medium">Filter by Impact</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="impact-low" onCheckedChange={(checked) => handleImpactChange(checked, 'Low')} />
                    <Label htmlFor="impact-low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="impact-medium" onCheckedChange={(checked) => handleImpactChange(checked, 'Medium')} />
                    <Label htmlFor="impact-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="impact-high" onCheckedChange={(checked) => handleImpactChange(checked, 'High')} />
                    <Label htmlFor="impact-high">High</Label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-medium">Filter by Owner</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="owner-neelaksh" onCheckedChange={(checked) => handleOwnerChange(checked, 'Neelaksh')} />
                    <Label htmlFor="owner-neelaksh">Neelaksh</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="owner-sayonsom" onCheckedChange={(checked) => handleOwnerChange(checked, 'Sayonsom')} />
                    <Label htmlFor="owner-sayonsom">Sayonsom</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="owner-hari" onCheckedChange={(checked) => handleOwnerChange(checked, 'Hari')} />
                    <Label htmlFor="owner-hari">Hari</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="owner-prathmesh" onCheckedChange={(checked) => handleOwnerChange(checked, 'Prathmesh')} />
                    <Label htmlFor="owner-prathmesh">Prathmesh</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="owner-riktesh" onCheckedChange={(checked) => handleOwnerChange(checked, 'Riktesh')} />
                    <Label htmlFor="owner-riktesh">Riktesh</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="owner-rahul" onCheckedChange={(checked) => handleOwnerChange(checked, 'Rahul')} />
                    <Label htmlFor="owner-rahul">Rahul</Label>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter; 