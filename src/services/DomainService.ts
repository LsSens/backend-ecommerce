export class DomainService {
    async verifyCompanyDomain(domain: string): Promise<any> {
        try {
         const data = {
          isValid: true,
          isPointingToAWS: true,
          domain,
          status: 200
         }
          return data;
        } catch (error) {
          throw error;
        }
      } 
}