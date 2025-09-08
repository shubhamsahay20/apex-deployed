// import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
// import userThree from '../images/user/user-03.png';

const Settings = () => {
  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-black-2 font-semibold">Settings</h2>
          <label className="inline-flex items-center cursor-pointer relative">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition duration-300" />
            <div className="absolute w-5 h-5 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5 translate-x-1" />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
          <span className="text-sm font-medium text-black-2 whitespace-nowrap">
            Force cancel/modify orders
          </span>
        </div>

        <p className="font-medium text-sm leading-5 tracking-normal font-inter mb-[14px]">
          Borem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar.
        </p>
      </div>
    </>
  );
};

export default Settings;
