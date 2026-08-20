export default function StatCard({title, value}){
    return (
      <div className="rounded-xl bg-white p-6 shadow-md">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>
  
        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {value}
        </h2>
      </div>
    );
};

