import json
from testing import client


def assertion_test(response_object):
    assert 'ranges' in response_object
    assert 'finishedLengthInches' in response_object['ranges']
    assert 'finishedWidthInches' in response_object['ranges']
    assert 'finishedHeightInches' in response_object['ranges']
    assert 'finishedVolumeInches3' in response_object['ranges']
    assert 'stockWeightPounds' in response_object['ranges']
    assert 'finishedSurfaceAreaInches2' in response_object['ranges']
    assert 'buyToFly' in response_object['ranges']
    assert 'results' in response_object
    assert 'compoundNumberClean' in response_object['results'][0]
    assert 'compoundName' in response_object['results'][0]
    assert 'compoundElement' in response_object['results'][0]
    assert 'compoundForm' in response_object['results'][0]
    assert 'program' in response_object['results'][0]
    assert 'finishedLengthInches' in response_object['results'][0]
    assert 'finishedWidthInches' in response_object['results'][0]
    assert 'finishedHeightInches' in response_object['results'][0]
    assert 'finishedVolumeInches3' in response_object['results'][0]
    assert 'stockWeightPounds' in response_object['results'][0]
    assert 'finishedSurfaceAreaInches2' in response_object['results'][0]
    assert 'buyToFly' in response_object['results'][0]


def test_compounds_list(client):
    role_config = {'ADMIN': 109, 'NMA USER': 109, 'USER': 108, 'GUEST': 108}
    for role, row_count in role_config.items():
        url = '/compounds/'
        data = {'role': role,
                'filters': {},
                'search': {},
                'sort': {},
                'range_filters': {},
                'start': 1,
                'limit': 25
                }
        headers = {'Content-Type': 'application/json',
                   'Accept': 'application/json'
                   }
        response = client.post(url, data=json.dumps(data), headers=headers)
        json_data = json.loads(response.data)
        assert len(json_data) > 0
        assert json_data['count'] == row_count

        assertion_test(json_data)


def test_compounds_list_alphabetic_filtering(client):
    url = '/compounds/'
    data = {'role': 'ADMIN',
            'filters': {},
            'search': {},
            'sort': {},
            'range_filters': {},
            'start': 1,
            'limit': 25
            }
    aluminum_data = {'role': 'ADMIN',
                     'filters': {'compoundElement': ['ALUMINUM']},
                     'search': {},
                     'sort': {},
                     'range_filters': {},
                     'start': 1,
                     'limit': 25
                    }
    aluminum_search_data = {'role': 'ADMIN',
                            'filters': {'compoundElement': ['ALUMINUM']},
                            'search': {'compoundNumberClean': '1*****4-2'},
                            'sort': {},
                            'range_filters': {},
                            'start': 1,
                            'limit': 25
                            }
    headers = {'Content-Type': 'application/json',
               'Accept': 'application/json'
               }
    response = client.post(url, data=json.dumps(data), headers=headers)
    compounds_list = json.loads(response.data)
    response = client.post(url, data=json.dumps(aluminum_data), headers=headers)
    aluminum_compounds_list = json.loads(response.data)
    response = client.post(url, data=json.dumps(aluminum_search_data), headers=headers)
    aluminum_search_list = json.loads(response.data)
    assert len(compounds_list) > 0
    assert len(aluminum_compounds_list) > 0
    assert len(aluminum_search_list) > 0
    assert aluminum_compounds_list['count'] < compounds_list['count']
    assert aluminum_search_list['count'] < aluminum_compounds_list['count']

    assertion_test(aluminum_compounds_list)
    assertion_test(aluminum_search_list)


def test_compounds_list_num_filtering(client):
    url = '/compounds/'
    data = {'role': 'ADMIN',
            'filters': {},
            'search': {},
            'sort': {},
            'range_filters': {},
            'start': 1,
            'limit': 25
            }
    fl_data = {'role': 'ADMIN',
               'filters': {},
               'search': {},
               'sort': {},
               'range_filters': {'finishedLengthInches': [0.08,1]},
               'start': 1,
               'limit': 25
               }
    fl_search_data = {'role': 'ADMIN',
                      'filters': {},
                      'search': {'compoundNumberClean': '1*****1-8'},
                      'sort': {},
                      'range_filters': {'finishedLengthInches': [0.08,1]},
                      'start': 1,
                      'limit': 25
                      }
    headers = {'Content-Type': 'application/json',
               'Accept': 'application/json'
               }
    response = client.post(url, data=json.dumps(data), headers=headers)
    compounds_list = json.loads(response.data)
    response = client.post(url, data=json.dumps(fl_data), headers=headers)
    fl_compounds_list = json.loads(response.data)
    response = client.post(url, data=json.dumps(fl_search_data), headers=headers)
    fl_search_list = json.loads(response.data)
    assert len(compounds_list) > 0
    assert len(fl_compounds_list) > 0
    assert len(fl_search_list) > 0
    assert fl_compounds_list['count'] < compounds_list['count']
    assert fl_search_list['count'] < fl_compounds_list['count']

    assertion_test(fl_compounds_list)
    assertion_test(fl_search_list)


def test_compounds_list_sorting(client):
    url = '/compounds/'
    ascending_data = {'role': 'ADMIN',
                      'filters': {},
                      'search': {},
                      'sort': {'compoundNumberClean': 'ascending'},
                      'range_filters': {},
                      'start': 1,
                      'limit': 25
            }
    descending_data = {'role': 'ADMIN',
                       'filters': {},
                       'search': {},
                       'sort': {'compoundNumberClean': 'descending'},
                       'range_filters': {},
                       'start': 1,
                       'limit': 25
                    }
    headers = {'Content-Type': 'application/json',
               'Accept': 'application/json'
               }
    asc_response = client.post(url, data=json.dumps(ascending_data), headers=headers)
    asc_compounds_list = json.loads(asc_response.data)
    desc_response = client.post(url, data=json.dumps(descending_data), headers=headers)
    desc_compounds_list = json.loads(desc_response.data)
    assert len(asc_compounds_list) > 0
    assert len(desc_compounds_list) > 0

    assertion_test(asc_compounds_list)
    assertion_test(desc_compounds_list)

    assert '1*****0-1' in asc_compounds_list['results'][0]['compoundNumberClean']
    assert '6*****8-9' in desc_compounds_list['results'][0]['compoundNumberClean']


def test_compounds_summary(client):
    url = '/compounds/summary'
    data = {'role': 'ADMIN'}
    headers = {'Content-Type': 'application/json',
               'Accept': 'application/json'
               }
    response = client.post(url, data=json.dumps(data), headers=headers)
    json_data = json.loads(response.data)
    assert len(json_data) > 0
    assert 'aluminum' in json_data
    assert 'extrusion' in json_data
    assert 'plane 1' in json_data
    assert 'plane 2' in json_data
    assert 'plane 3' in json_data
    assert 'plate' in json_data
    assert 'titanium' in json_data
    assert 'totalcompounds' in json_data


def test_similar_compounds(client):
    url = '/compounds/'
    data = {'role': 'ADMIN',
                 'filters': {},
                 'search': {},
                 'sort': {},
                 'n_compounds': 25,
                 'compound_number': '1*****4-2',
                 'range_filters': {},
                 'start': 1,
                 'limit': 25
            }
    headers = {'Content-Type': 'application/json',
               'Accept': 'application/json'
               }
    response = client.post(url, data=json.dumps(data), headers=headers)
    similar_compounds = json.loads(response.data)
    assert len(similar_compounds) > 0
    assert similar_compounds['count'] > 0

    assertion_test(similar_compounds)
    assert 'similarityRank' in similar_compounds['results'][0]


def test_part(client):
    url = '/compounds/1*****4-2'
    json_data = {'role': 'ADMIN'}
    headers = {'Content-Type': 'application/json',
               'Accept': 'application/json'
               }
    response = client.post(url, data=json.dumps(json_data), headers=headers)
    json_data = json.loads(response.data)
    assert 'activeSetupAxisCount' in json_data[0]
    assert 'blindHolesCount' in json_data[0]
    assert 'buyToFly' in json_data[0]
    assert 'closedAngledSurfacesCount' in json_data[0]
    assert 'complexCurveSurfaceAreaInches2' in json_data[0]
    assert 'complexCurveSurfaceCount' in json_data[0]
    assert 'complexHoleCount' in json_data[0]
    assert 'curvedSurfaceAreaInches2' in json_data[0]
    assert 'deepHoleCount' in json_data[0]
    assert 'deepPocketCount' in json_data[0]
    assert 'filletCount' in json_data[0]
    assert 'finishedHeightInches' in json_data[0]
    assert 'finishedLengthInches' in json_data[0]
    assert 'finishedSurfaceAreaInches2' in json_data[0]
    assert 'finishedVolumeInches3' in json_data[0]
    assert 'finishedWidthInches' in json_data[0]
    assert 'flatBottomHolesCount' in json_data[0]
    assert 'hardSetupCount' in json_data[0]
    assert 'heightExternalSilhouetteAreaInches2' in json_data[0]
    assert 'heightExternalSilhouetteLengthInches' in json_data[0]
    assert 'heightExternalSilhouetteX' in json_data[0]
    assert 'heightExternalSilhouetteY' in json_data[0]
    assert 'heightExternalSilhouetteZ' in json_data[0]
    assert 'heightPercentBoundingFilled' in json_data[0]
    assert 'hexHoleCount' in json_data[0]
    assert 'lengthExternalSilhouetteAreaInches2' in json_data[0]
    assert 'lengthExternalSilhouetteLengthInches' in json_data[0]
    assert 'lengthExternalSilhouetteX' in json_data[0]
    assert 'lengthExternalSilhouetteY' in json_data[0]
    assert 'lengthExternalSilhouetteZ' in json_data[0]
    assert 'lengthPercentBoundingFilled' in json_data[0]
    assert 'minMachineAxisRequired' in json_data[0]
    assert 'multistepHoleCount' in json_data[0]
    assert 'nonPerpendicularHoleCount' in json_data[0]
    assert 'nonPerpendicularHolesCount' in json_data[0]
    assert 'nonstandardFilletCount' in json_data[0]
    assert 'nonstandardHoleCount' in json_data[0]
    assert 'obstructedSurfacesCount' in json_data[0]
    assert 'compoundForm' in json_data[0]
    assert 'compoundElement' in json_data[0]
    assert 'compoundName' in json_data[0]
    assert 'compoundNumber' in json_data[0]
    assert 'compoundNumberClean' in json_data[0]
    assert 'partiallyObstructedSurfacesCount' in json_data[0]
    assert 'program' in json_data[0]
    assert 'ruledSurfacesCount' in json_data[0]
    assert 'sharpPocketFloorCount' in json_data[0]
    assert 'sharpWallCornerCount' in json_data[0]
    assert 'simpleHoleCount' in json_data[0]
    assert 'standardFilletCount' in json_data[0]
    assert 'standardHoleCount' in json_data[0]
    assert 'stockHeightInches' in json_data[0]
    assert 'stockLengthInches' in json_data[0]
    assert 'stockSurfaceAreaInches2' in json_data[0]
    assert 'stockVolumeInches3' in json_data[0]
    assert 'stockWeightPounds' in json_data[0]
    assert 'stockWidthInches' in json_data[0]
    assert 'surfaceAreaRuledSurfacesInches2' in json_data[0]
    assert 'totalAxisAndSurfacesCount' in json_data[0]
    assert 'totalHoleCount' in json_data[0]
    assert 'totalPocketCount' in json_data[0]
    assert 'totalSurfaceAreaNormalInches2' in json_data[0]
    assert 'totalSurfaceCount' in json_data[0]
    assert 'widthExternalSilhouetteAreaInches2' in json_data[0]
    assert 'widthExternalSilhouetteLengthInches' in json_data[0]
    assert 'widthExternalSilhouetteX' in json_data[0]
    assert 'widthExternalSilhouetteY' in json_data[0]
    assert 'widthExternalSilhouetteZ' in json_data[0]
    assert 'widthPercentBoundingFilled' in json_data[0]
