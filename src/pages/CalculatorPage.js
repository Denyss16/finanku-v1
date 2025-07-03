import React from 'react';
import { ShieldCheck, GraduationCap, BarChart, Sun } from 'lucide-react';

// Corrected imports
import DanaDarurat from '../components/DanaDarurat';
import KalkulatorPendidikanAnak from '../components/KalkulatorPendidikanAnak';
import InvestasiMasaDepan from '../components/InvestasiMasaDepan';
import DanaPensiun from '../components/DanaPensiun';

const tabs = [
  {
    id: "danaDarurat",
    label: "Dana Darurat",
    icon: ShieldCheck,
    component: <DanaDarurat />,
    color: "cyan",
  },
  {
    id: "pendidikanAnak",
    label: "Pendidikan Anak",
    icon: GraduationCap,
    component: <KalkulatorPendidikanAnak />,
    color: "purple",
  },
  {
    id: "investasiMasaDepan",
    label: "Investasi",
    icon: BarChart,
    component: <InvestasiMasaDepan />,
    color: "blue",
  },
  {
    id: "danaPensiun",
    label: "Dana Pensiun",
    icon: Sun,
    component: <DanaPensiun />,
    color: "amber",
  },
];

const CalculatorPage = ({ activeCalculator, onCalculatorChange, onSaveTarget }) => {
  const activeTab = activeCalculator || 'danaDarurat';

  const colorClasses = {
    active: {
      cyan: "bg-cyan-600 text-white shadow-lg",
      purple: "bg-purple-600 text-white shadow-lg",
      blue: "bg-blue-600 text-white shadow-lg",
      amber: "bg-amber-500 text-white shadow-lg",
    },
    inactive: "bg-white text-slate-600 hover:bg-slate-100 hover:shadow-md",
    border: {
      cyan: "border-cyan-500",
      purple: "border-purple-500",
      blue: "border-blue-500",
      amber: "border-amber-500",
    },
  };

  const bgSoft = {
    cyan: "bg-cyan-50",
    purple: "bg-purple-50",
    blue: "bg-blue-50",
    amber: "bg-amber-50",
  };

    const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;
  const componentWithProps = activeComponent ? React.cloneElement(activeComponent, { onSaveTarget }) : null;
  const activeColor = tabs.find(tab => tab.id === activeTab)?.color || 'cyan';

  return (
    <div className="py-10 px-4 md:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar for navigation */}
          <aside className="w-full lg:w-1/4">
            <div className="lg:sticky lg:top-24">
              {/* Vertical list on all screen sizes */}
              <div className="pb-4 lg:pb-0">
                <ul className="flex flex-col space-y-2">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => onCalculatorChange(tab.id)}
                        className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 ${activeTab === tab.id ? colorClasses.active[tab.color] : colorClasses.inactive}`}
                      >
                        <tab.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="font-semibold">{tab.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main content area */}
          <main className="w-full lg:w-3/4">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800">Kalkulator Finansial</h1>
              <p className="text-gray-600 mt-2">Pilih kalkulator yang sesuai dengan kebutuhan perencanaan Anda.</p>
            </div>
            <div className={`p-6 md:p-8 rounded-2xl shadow-lg border-t-4 ${colorClasses.border[activeColor]} ${bgSoft[activeColor]}`}>
              {componentWithProps}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
