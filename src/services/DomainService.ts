import { promises as dns } from 'dns';

export class DomainService {
    async verifyCompanyDomain(domain: string): Promise<any> {
        try {
            const nsRecords = await dns.resolveNs(domain);
            
            const correctNameservers = [
                'ns-1465.awsdns-55.org',
                'ns-1465.awsdns-55.org.',
                'ns-543.awsdns-03.net',
                'ns-543.awsdns-03.net.',
                'ns-418.awsdns-52.com',
                'ns-418.awsdns-52.com.',
                'ns-1873.awsdns-42.co.uk',
                'ns-1873.awsdns-42.co.uk.'
            ];
            
            const isPointingToAWS = nsRecords.every(ns => 
                correctNameservers.includes(ns)
            );

            if (isPointingToAWS) {
                return {
                    isValid: true,
                    domain,
                    status: 200
                };
            } else {
                return {
                    isValid: false,
                    domain,
                    status: 422
                };
            }
        } catch (error) {
            return {
                isValid: false,
                domain,
                error: error.message,
                status: 400
            };
        }
    }
}