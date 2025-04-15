from six.moves.urllib.request import urlopen
import json
def get_sage_field_NF(label): # get field from db, return as sage object
   url = 'https://beta.lmfdb.org/api/nf_fields/?label=' + label + '&_format=json&_fields=coeffs&_delim=;'
   page = urlopen(url)
   dat = str(page.read().decode('utf-8'))
   dat = json.loads(dat)['data']
   if dat == []:
       log_file.write('Field not found in LMFDB: ' + str(label) + '\n')
       return 0
   C = dat[0]['coeffs']
   if C == [0,1]:
       return QQ
   R=PolynomialRing(QQ, 'z')
   z = R.gen(0)
   poly = 0
   for i in range(len(C)):
       poly += z**i*C[i]
   K = NumberField(poly, 'a')
   return K
def make_sage_func_NF(coeffs, field_label):
   """
   Given a field label and coefficients, return the sage dynamical system.
   """
   K = get_sage_field_NF(field_label)
   P = ProjectiveSpace(K,1,'x,y')
   R = P.coordinate_ring()
   x,y = R.gens()
   d = len(coeffs[0])-1
   polys = []
   for L in coeffs:
       poly = 0
       for i in range(0,d+1):
           poly += x**(d-i)*y**i*K(L[i])
       polys.append(poly)
   return DynamicalSystem(polys, domain=P)
#read back in data_list from the csv file, then do the following
function_list=[]
for i in range(len(data_list)):
   function_list.append([data_list[i][0],make_sage_func_NF(data_list[i][1], data_list[i][2])])