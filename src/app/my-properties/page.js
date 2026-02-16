import MyPropertiesContent from './MyPropertiesContent';

export const metadata = {
    title: 'My Properties',
    description: 'Manage your listed properties, view leads, and track performance on DealDirect.',
    robots: { index: false, follow: false },
};

export default function MyPropertiesPage() {
    return <MyPropertiesContent />;
}
