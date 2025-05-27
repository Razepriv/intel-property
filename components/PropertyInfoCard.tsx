import React from 'react';
import { PropertyDetails } from '../types';

// --- Icon Components (Consider moving to a separate file if many) ---
const BedIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.69Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /></svg>
);
const BathIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h2.25a3 3 0 1 1 6 0h.375c1.035 0 1.875-.84 1.875-1.875V15h-6c-1.24 0-2.25.56-2.25 1.25V17.25h-1.5v-1.5c0-.689-1.01-1.25-2.25-1.25Z" /><path d="M22.5 9.375c0-1.036-.84-1.875-1.875-1.875h-2.25V13.5h4.125V9.375Z" /></svg>
);
const AreaIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5a.75.75 0 0 0 1.5 0v-1.5h12v1.5a.75.75 0 0 0 1.5 0V3.75a.75.75 0 0 0 0-1.5h-15Zm0 9a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z" clipRule="evenodd" /></svg>
);
const PriceIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /><path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V4.5Zm16.5 1.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM12.75 19.5a.75.75 0 0 0 0-1.5H12a.75.75 0 0 0-.75.75v2.25H9.75a.75.75 0 0 0 0 1.5h2.25A.75.75 0 0 0 12.75 22.5v-3Z" clipRule="evenodd" /><path d="M12.75 6a.75.75 0 0 0-1.5 0v.092c-.61.195-1.12.58-1.464 1.078a.75.75 0 0 0 1.214.899C11.261 7.74 11.557 7.5 12 7.5h.004c.442 0 .738.24.99.521a.75.75 0 0 0 1.213-.9A2.253 2.253 0 0 0 12.75 6Z" /></svg>
);
const TypeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M.75 4.75A.75.75 0 0 1 1.5 4h13.5a.75.75 0 0 1 0 1.5H1.5A.75.75 0 0 1 .75 4.75ZM.75 8.25A.75.75 0 0 1 1.5 7.5h13.5a.75.75 0 0 1 0 1.5H1.5A.75.75 0 0 1 .75 8.25Zm.75 3A.75.75 0 0 0 1.5 12h13.5a.75.75 0 0 0 0-1.5H1.5a.75.75 0 0 0-.75.75ZM1.5 15.75a.75.75 0 0 1 .75-.75H8.25a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1-.75-.75ZM17.25 15A2.25 2.25 0 0 0 15 17.25v.065a.75.75 0 0 1-.75.75h-.195a.75.75 0 0 1-.75-.75V17.25a4.5 4.5 0 1 1 9 0v.065a.75.75 0 0 1-.75.75h-.195a.75.75 0 0 1-.75-.75V17.25A2.25 2.25 0 0 0 19.5 15h-2.25Z" clipRule="evenodd" /></svg>
);
const BuildingIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.572a.75.75 0 0 0 .372.648l8.628 5.032Z" /></svg>
);
const TagIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.25 2.25a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 .75.75H10.5a.75.75 0 0 0 0-1.5H6v-9h12v4.5a.75.75 0 0 0 1.5 0V3a.75.75 0 0 0-.75-.75H5.25ZM18 12.75a.75.75 0 0 0-.75.75v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0V18h2.25a.75.75 0 0 0 0-1.5H19.5v-2.25a.75.75 0 0 0-.75-.75Z" clipRule="evenodd" /></svg>
);
const InfoIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>
);
const UserIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
);
const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M12.832 2.174a3.75 3.75 0 0 0-1.664 0l-9 3.75A.75.75 0 0 0 1.5 6.655V18.44a3.75 3.75 0 0 0 1.981 3.406l7.5 3.75a.75.75 0 0 0 .038.012l.001.002a4.505 4.505 0 0 0 2.008.496h.01a4.505 4.505 0 0 0 2.007-.496l.002-.002.038-.012 7.5-3.75A3.75 3.75 0 0 0 22.5 18.44V6.655a.75.75 0 0 0-.668-.731l-9-3.75ZM11.11 6.127c.041-.017.083-.032.124-.045l.013-.004c.042-.012.085-.023.128-.033l.014-.003c.043-.01.086-.018.13-.025l.028-.005c.044-.006.088-.01.132-.012h.012c.044.002.088.006.132.012l.028.005c.044.007.087.015.13.025l.014.003c.043.01.086.02.128.032l.013.004c.04.013.082.028.124.045l6.92 2.883c.243.101.243.437 0 .538l-6.92 2.883a.62.62 0 0 1-.235.052h-.012a.622.622 0 0 1-.235-.052l-6.92-2.883c-.243-.101-.243-.437 0-.538l6.92-2.883Z" clipRule="evenodd" /><path d="m11.083 13.352.013.003c.042.012.085.023.128.033l.014.003c.043.01.086.018.13.025l.028.005c.044.006.088.01.132.012h.012c.044.002.088.006.132.012l.028.005c.044.007.087.015.13.025l.014.003c.043.01.086.02.128.032l.013.004 6.92 2.883c.243.101.243.437 0 .538l-6.92 2.883a.62.62 0 0 1-.235.052h-.012a.622.622 0 0 1-.235-.052L4.162 16.77c-.243-.101-.243-.437 0-.538l6.92-2.883Z" /></svg>
);
const IdCardIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5A1.5 1.5 0 0 0 7.5 20.25h9a1.5 1.5 0 0 0 1.5-1.5V5.25A1.5 1.5 0 0 0 16.5 3.75h-9ZM15 6.75a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H15.75a.75.75 0 0 1-.75-.75V6.75ZM15 9a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H15.75a.75.75 0 0 1-.75-.75V9Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75h-.008ZM9.75 7.5a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Z" /><path d="M4.5 19.5A2.25 2.25 0 0 0 6.75 21.75h10.5A2.25 2.25 0 0 0 19.5 19.5v-15A2.25 2.25 0 0 0 17.25 2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15Z" /></svg>
);


// --- Helper Components ---
interface DetailItemProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode; // Changed from string | number | null | undefined
  isList?: boolean;
  listItems?: string[];
  className?: string;
  valueClassName?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, isList, listItems, className = "mb-2", valueClassName = "" }) => {
  if (isList && (!listItems || listItems.length === 0)) return null;
  if (!isList && (value === null || value === undefined || (typeof value === 'string' && value.trim() === ''))) return null;

  return (
    <div className={`flex items-start text-slate-300 ${className}`}>
      {icon && <div className="flex-shrink-0 w-6 h-6 mr-2 text-sky-400">{icon}</div>}
      <div className="flex-grow">
        <span className="font-semibold text-slate-200 mr-2">{label}:</span>
        {isList && listItems ? (
          <div className={`flex flex-wrap gap-1 mt-1 ${valueClassName}`}>
            {listItems.map((item, index) => (
              <span key={index} className="bg-slate-700 text-sky-200 text-xs font-medium px-2 py-0.5 rounded-full">
                {item}
              </span>
            ))}
          </div>
        ) : (
          <span className={`text-slate-300 ${valueClassName}`}>{value !== null && value !== undefined ? value : 'N/A'}</span>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className="" }) => (
  <div className={`mb-6 ${className}`}>
    <h3 className="text-lg font-semibold text-sky-400 mb-3 flex items-center">
      {icon && <span className="mr-2 w-5 h-5">{icon}</span>}
      {title}
    </h3>
    {children}
  </div>
);

// --- Main Card Component ---
interface PropertyInfoCardProps {
  details: PropertyDetails;
}

const PropertyInfoCard: React.FC<PropertyInfoCardProps> = ({ details }) => {
  const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A';
    return `$${price.toLocaleString()}`;
  };

  const primaryImage = details.images && details.images.length > 0 ? details.images[0] : `https://picsum.photos/seed/${encodeURIComponent(details.address || 'randomproperty')}/800/600`;

  return (
    <div className="bg-slate-800 shadow-2xl rounded-lg overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-[1.01] scroll-mt-24">
      <img 
        src={primaryImage} 
        alt={details.propertyTitle || details.propertyType || 'Property Image'} 
        className="w-full h-72 object-cover"
        onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(details.address || 'randomerror')}/800/600`)} // Fallback for broken image links
      />
      <div className="p-6">
        {details.propertyTitle && <h1 className="text-3xl font-bold text-sky-300 mb-1">{details.propertyTitle}</h1>}
        <p className="text-xl font-semibold text-slate-300 mb-3">{details.address || 'Address Not Available'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-6 border-b border-slate-700 pb-6">
          <DetailItem icon={<PriceIcon />} label="Price" value={formatPrice(details.price)} valueClassName="text-2xl font-bold text-green-400"/>
          <DetailItem icon={<TypeIcon />} label="Type" value={details.propertyType} />
          <DetailItem icon={<BedIcon />} label="Bedrooms" value={details.bedrooms} />
          <DetailItem icon={<BathIcon />} label="Bathrooms" value={details.bathrooms} />
          <DetailItem icon={<AreaIcon />} label="Sq. Ft." value={details.sqft ? `${details.sqft.toLocaleString()} sq ft` : 'N/A'} />
          <DetailItem icon={<TagIcon />} label="Purpose" value={details.purpose} />
          <DetailItem icon={<TagIcon />} label="Furnishing" value={details.furnishingType} />
        </div>

        {details.description && (
          <Section title="Description" icon={<InfoIcon />}>
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{details.description}</p>
          </Section>
        )}

        {(details.keyFeatures && details.keyFeatures.length > 0) && (
             <Section title="Key Features" icon={<TagIcon />}>
                <div className="flex flex-wrap gap-2">
                {details.keyFeatures.map((feature, index) => (
                    <span key={`kf-${index}`} className="bg-sky-700 text-sky-100 text-xs font-semibold px-3 py-1 rounded-full">
                    {feature}
                    </span>
                ))}
                </div>
            </Section>
        )}
        
        {(details.amenities && details.amenities.length > 0) && (
             <Section title="Amenities" icon={<TagIcon />}>
                <div className="flex flex-wrap gap-2">
                {details.amenities.map((amenity, index) => (
                    <span key={`am-${index}`} className="bg-teal-700 text-teal-100 text-xs font-semibold px-3 py-1 rounded-full">
                    {amenity}
                    </span>
                ))}
                </div>
            </Section>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {details.buildingInformation && (
                <Section title="Building Information" icon={<BuildingIcon />}>
                    <p className="text-slate-300 text-sm">{details.buildingInformation}</p>
                </Section>
            )}

            {(details.validatedInformation && details.validatedInformation.length > 0) && (
                <Section title="Validated Information" icon={<ShieldCheckIcon />}>
                     <DetailItem isList listItems={details.validatedInformation} label="" value={null} />
                </Section>
            )}
        </div>


        <Section title="Regulatory & IDs" icon={<IdCardIcon />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <DetailItem label="Permit No." value={details.permitNumber} />
                <DetailItem label="DED No." value={details.dedNumber} />
                <DetailItem label="RERA No." value={details.reraNumber} />
                <DetailItem label="Reference ID" value={details.referenceId} />
                <DetailItem label="BRN/DLD" value={details.brnDld} />
            </div>
        </Section>
        
        {details.listedBy && (details.listedBy.name || details.listedBy.phone || details.listedBy.email || details.listedBy.company) && (
            <Section title="Listed By" icon={<UserIcon />}>
                <DetailItem label="Name" value={details.listedBy.name} />
                <DetailItem label="Company" value={details.listedBy.company} />
                <DetailItem label="Phone" value={details.listedBy.phone ? <a href={`tel:${details.listedBy.phone}`} className="text-sky-400 hover:underline">{details.listedBy.phone}</a> : 'N/A'} />
                <DetailItem label="Email" value={details.listedBy.email ? <a href={`mailto:${details.listedBy.email}`} className="text-sky-400 hover:underline">{details.listedBy.email}</a> : 'N/A'} />
            </Section>
        )}

        {details.images && details.images.length > 1 && (
          <Section title="Additional Images" icon={<BuildingIcon />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {details.images.slice(1, 5).map((imgUrl, index) => ( // Show up to 4 additional images
                <a key={index} href={imgUrl} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={imgUrl} 
                    alt={`Property image ${index + 2}`} 
                    className="w-full h-24 object-cover rounded-md hover:opacity-80 transition-opacity"
                    onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if additional image fails
                  />
                </a>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
};

export default PropertyInfoCard;