class Param:
    def __init__(self, key, value):
        self.key = key
        self.value = value

    def __repr__(self):
        return 'Param(%r)' % (self.value,)


def to_qmark(chunks):
    query_compounds = []
    params = []
    for chunk in chunks:
        if isinstance(chunk, Param):
            params.append(chunk.value)
            query_compounds.append('?')
        else:
            query_compounds.append(chunk)
    return ''.join(query_compounds), params


def to_pyformat(chunks):
    query_compounds = []
    params = {}
    for chunk in chunks:
        if isinstance(chunk, Param):
            name = chunk.key
            params[name] = chunk.value
            query_compounds.append('%%(%s)s' % name)
        else:
            query_compounds.append(chunk.replace('%', '%%'))
    return ''.join(query_compounds), params
